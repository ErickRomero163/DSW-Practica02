import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthSessionService } from './auth-session.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorMapperService {
  constructor(
    private readonly authSessionService: AuthSessionService,
    private readonly router: Router
  ) {}

  mapMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'Solicitud inválida. Verifica los datos enviados.';
      case 401:
        return 'Sesión expirada o credenciales inválidas. Inicia sesión nuevamente.';
      case 404:
        return 'No se encontró el recurso solicitado.';
      case 409:
        return 'Conflicto de datos. Revisa duplicados o dependencias activas.';
      default:
        return 'Ocurrió un error inesperado en la comunicación con el servidor.';
    }
  }

  handle(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.authSessionService.logout();
      void this.router.navigate(['/login']);
    }

    const mappedError = {
      status: error.status,
      message: this.mapMessage(error),
      details: error.error
    };

    return throwError(() => mappedError);
  }
}
