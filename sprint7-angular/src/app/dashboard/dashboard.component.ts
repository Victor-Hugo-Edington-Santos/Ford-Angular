import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle, VehicleData } from '../models/vehicle.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Passo 8: opções do dropdown, carregadas do back-end
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  dropdownAberto = false;

  // Passo 11: busca por código do veículo (VIN)
  vin = '';
  vehicleData: VehicleData | null = null;
  erroVin = '';
  buscando = false;

  // Tamanho dos códigos VIN cadastrados na API (ex.: 2FRHDUYS2Y63NHD22454 tem 20 caracteres).
  // Usar 17 (padrão VIN real) disparava buscas para códigos incompletos enquanto o
  // usuário ainda digitava, mostrando "não encontrado" antes da hora.
  private readonly vinMinLength = 20;

  // Passo 11: códigos VIN cadastrados na API, exibidos para seleção rápida
  vinOptions: string[] = [
    '2FRHDUYS2Y63NHD22454',
    '2RFAASDY54E4HDU34874',
    '2FRHDUYS2Y63NHD22455',
    '2RFAASDY54E4HDU34875',
    '2FRHDUYS2Y63NHD22654',
    '2FRHDUYS2Y63NHD22854'
  ];

  private vin$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private vehicleService: VehicleService) {}

  /** Fecha o dropdown ao clicar em qualquer lugar fora dele. */
  @HostListener('document:click')
  fecharDropdown(): void {
    this.dropdownAberto = false;
  }

  ngOnInit(): void {
    // Passo 8: busca das opções de preenchimento no back-end (o service usa "pluck"
    // para extrair a propriedade "vehicles" da resposta).
    this.vehicleService
      .getVehicles()
      .pipe(
        // Normaliza o nome do modelo para exibição no dropdown
        map((vehicles) =>
          vehicles.map((v) => ({ ...v, vehicle: v.vehicle.trim() }))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((vehicles) => {
        this.vehicles = vehicles;
        if (vehicles.length) {
          this.selectVehicle(vehicles[0]);
        }
      });

    // Passo 11: busca reativa por VIN.
    // debounceTime  -> espera o usuário parar de digitar
    // map           -> normaliza o texto (sem espaços, maiúsculo)
    // distinctUntilChanged -> ignora o mesmo código digitado de novo
    // filter        -> só busca quando o código tem tamanho plausível
    // switchMap     -> cancela a requisição anterior ao digitar um novo código
    this.vin$
      .pipe(
        debounceTime(400),
        map((codigo) => codigo.trim().toUpperCase()),
        distinctUntilChanged(),
        filter((codigo) => codigo.length >= this.vinMinLength),
        switchMap((codigo) => {
          this.buscando = true;
          this.erroVin = '';
          return this.vehicleService.getVehicleData(codigo).pipe(
            catchError((err) => {
              this.erroVin = err?.error?.message || 'Código VIN não encontrado.';
              return of(null);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.buscando = false;
        this.vehicleData = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Abre/fecha a lista de modelos do primeiro cartão. */
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownAberto = !this.dropdownAberto;
  }

  /** Passo 9 e 10: ao selecionar o modelo, cartões e imagem são atualizados. */
  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.dropdownAberto = false;
  }

  get totalVendas(): number {
    return this.selectedVehicle?.volumetotal ?? 0;
  }

  get conectados(): number {
    return this.selectedVehicle?.connected ?? 0;
  }

  get softwareAtualizado(): number {
    return this.selectedVehicle?.softwareUpdates ?? 0;
  }

  /** Cada tecla digitada alimenta o fluxo reativo do VIN. */
  onVinChange(codigo: string): void {
    this.vehicleData = null;
    this.erroVin = '';
    this.vin$.next(codigo);
  }

  /** Ao clicar em um dos códigos cadastrados, preenche o campo e busca na hora. */
  onVinSelecionado(codigo: string): void {
    this.vin = codigo;
    this.buscarVeiculo();
  }

  /** Busca imediata (botão da lupa ou tecla Enter), sem esperar o debounce. */
  buscarVeiculo(): void {
    const codigo = this.vin.trim().toUpperCase();

    this.erroVin = '';
    this.vehicleData = null;

    if (!codigo) {
      this.erroVin = 'Informe o código do veículo.';
      return;
    }

    this.buscando = true;
    this.vehicleService
      .getVehicleData(codigo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.buscando = false;
          this.vehicleData = data;
        },
        error: (err) => {
          this.buscando = false;
          this.erroVin = err?.error?.message || 'Código VIN não encontrado.';
        }
      });
  }
}
