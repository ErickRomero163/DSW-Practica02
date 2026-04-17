import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthSessionService } from './services/auth-session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header style="padding: 1rem; border-bottom: 1px solid #ddd; display: flex; gap: 1rem; align-items: center;">
      <a routerLink="/departamentos">Departamentos</a>
      <a routerLink="/empleados">Empleados</a>
      <a routerLink="/login">Login</a>
      <span *ngIf="authSessionService.isAuthenticated()">
        Usuario: {{ authSessionService.getUsername() }}
      </span>
      <button *ngIf="authSessionService.isAuthenticated()" type="button" (click)="logout()">
        Cerrar sesión
      </button>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  constructor(
    public readonly authSessionService: AuthSessionService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authSessionService.logout();
    void this.router.navigate(['/login']);
  }
}
