import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'ford_user';

  constructor(private http: HttpClient) {}

  login(nome: string, senha: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/login`, { nome, senha }).pipe(
      tap((user) => localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user)))
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
