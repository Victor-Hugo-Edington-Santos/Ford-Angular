import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  usuario: User | null = this.authService.getUser();
  sidebarAberta = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.sidebarAberta = !this.sidebarAberta;
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
