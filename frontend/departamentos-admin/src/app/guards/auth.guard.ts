import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authSessionService: AuthSessionService,
    private readonly router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authSessionService.isAuthenticated()) {
      return true;
    }

    return this.router.parseUrl('/login');
  }
}
