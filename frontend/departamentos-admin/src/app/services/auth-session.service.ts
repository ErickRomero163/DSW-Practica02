import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {
  private username?: string;
  private basicAuthHeader?: string;

  login(username: string, password: string): void {
    const encoded = btoa(`${username}:${password}`);
    this.username = username;
    this.basicAuthHeader = `Basic ${encoded}`;
  }

  logout(): void {
    this.username = undefined;
    this.basicAuthHeader = undefined;
  }

  isAuthenticated(): boolean {
    return Boolean(this.basicAuthHeader);
  }

  getAuthorizationHeader(): string | undefined {
    return this.basicAuthHeader;
  }

  getUsername(): string | undefined {
    return this.username;
  }
}
