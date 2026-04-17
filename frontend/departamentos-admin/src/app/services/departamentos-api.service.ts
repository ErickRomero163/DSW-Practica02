import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AuthSessionService } from './auth-session.service';
import { HttpErrorMapperService } from './http-error-mapper.service';

export interface DepartamentoResponse {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface DepartamentoDetalleResponse extends DepartamentoResponse {
  empleados: EmpleadoResumenResponse[];
}

export interface EmpleadoResumenResponse {
  clave: string;
  nombre: string;
}

export interface DepartamentoRequest {
  nombre: string;
  descripcion?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentosApiService {
  private readonly apiBaseUrl = '/api/v1/departamentos';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authSessionService: AuthSessionService,
    private readonly httpErrorMapperService: HttpErrorMapperService
  ) {}

  list(): Observable<DepartamentoResponse[]> {
    return this.httpClient
      .get<DepartamentoResponse[]>(this.apiBaseUrl, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  create(request: DepartamentoRequest): Observable<DepartamentoResponse> {
    return this.httpClient
      .post<DepartamentoResponse>(this.apiBaseUrl, request, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  update(id: number, request: DepartamentoRequest): Observable<DepartamentoResponse> {
    return this.httpClient
      .put<DepartamentoResponse>(`${this.apiBaseUrl}/${id}`, request, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  delete(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiBaseUrl}/${id}`, { headers: this.buildHeaders() })
      .pipe(catchError((error) => this.httpErrorMapperService.handle(error)));
  }

  getDetalle(id: number): Observable<DepartamentoDetalleResponse> {
    return this.httpClient
      .get<DepartamentoDetalleResponse>(`${this.apiBaseUrl}/${id}`, { headers: this.buildHeaders() })
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
