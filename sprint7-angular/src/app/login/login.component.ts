import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nome = '';
  senha = '';
  mostrarSenha = false;
  loginAutomatico = false;
  erro = '';
  carregando = false;

  constructor(private authService: AuthService, private router: Router) {}

  entrar(): void {
    this.erro = '';

    if (!this.nome || !this.senha) {
      this.erro = 'Informe usuário e senha.';
      return;
    }

    this.carregando = true;
    this.authService.login(this.nome, this.senha).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.carregando = false;
        this.erro = err?.error?.message || 'Falha ao efetuar login.';
      }
    });
  }
}
