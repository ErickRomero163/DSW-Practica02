import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AuthSessionService } from './auth-session.service';
import { HttpErrorMapperService } from './http-error-mapper.service';
import { DepartamentoResponse } from './departamentos-api.service';

export interface EmpleadoRequest {
  nombre: string;
  direccion: string;
  telefono: string;
  departamentoId: number;
}

export interface EmpleadoResponse {
  clave: string;
  nombre: string;
  direccion: string;
  telefono: string;
  departamento: DepartamentoResponse;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosApiService {
  private readonly apiBaseUrl = '/api/v1/empleados';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authSessionService: AuthSessionService,
    private readonly httpErrorMapperService: HttpErrorMapperService
  ) {}

  list(): Observable<EmpleadoResponse[]> {
    return this.httpClient
      .get<EmpleadoResponse[]>(this.apiBaseUrl, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  getByClave(clave: string): Observable<EmpleadoResponse> {
    return this.httpClient
      .get<EmpleadoResponse>(`${this.apiBaseUrl}/${clave}`, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  create(request: EmpleadoRequest): Observable<EmpleadoResponse> {
    return this.httpClient
      .post<EmpleadoResponse>(this.apiBaseUrl, request, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  update(clave: string, request: EmpleadoRequest): Observable<EmpleadoResponse> {
    return this.httpClient
      .put<EmpleadoResponse>(`${this.apiBaseUrl}/${clave}`, request, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  delete(clave: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiBaseUrl}/${clave}`, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  private buildHeaders(): HttpHeaders {
    const authorizationHeader = this.authSessionService.getAuthorizationHeader();

    if (!authorizationHeader) {
      throw new Error('No hay sesión activa para invocar la API.');
    }

    return new HttpHeaders({
      Authorization: authorizationHeader,
      'Content-Type': 'application/json'
    });
  }
}
