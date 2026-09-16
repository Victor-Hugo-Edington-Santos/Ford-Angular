import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Vehicle, VehicleData } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  constructor(private http: HttpClient) {}

  // GET http://localhost:3001/vehicles -> { vehicles: Vehicle[] }
  // "pluck" extrai a propriedade "vehicles" da resposta, como pedido nos critérios de avaliação.
  getVehicles(): Observable<Vehicle[]> {
    return this.http
      .get<{ vehicles: Vehicle[] }>(`${environment.apiUrl}/vehicles`)
      .pipe(pluck('vehicles'));
  }

  // POST http://localhost:3001/vehicleData -> VehicleData
  getVehicleData(vin: string): Observable<VehicleData> {
    return this.http.post<VehicleData>(`${environment.apiUrl}/vehicleData`, { vin });
  }
}
