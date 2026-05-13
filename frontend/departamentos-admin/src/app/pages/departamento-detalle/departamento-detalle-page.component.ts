import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DepartamentoDetalleResponse,
  DepartamentosApiService
} from '../../services/departamentos-api.service';

@Component({
  selector: 'app-departamento-detalle-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <button type="button" (click)="goBack()" data-cy="detalle-volver">Volver</button>

      <p *ngIf="loading">Cargando detalle...</p>
      <p *ngIf="errorMessage">{{ errorMessage }}</p>

      <ng-container *ngIf="!loading && detalle">
        <h1 data-cy="detalle-nombre">{{ detalle.nombre }}</h1>
        <p>{{ detalle.descripcion || 'Sin descripción' }}</p>

        <h2>Empleados</h2>
        <p *ngIf="detalle.empleados.length === 0">Este departamento aún no tiene empleados asignados.</p>

        <ul *ngIf="detalle.empleados.length > 0" data-cy="detalle-empleados-list">
          <li *ngFor="let empleado of detalle.empleados">
            {{ empleado.nombre }} - {{ empleado.clave }}
          </li>
        </ul>
      </ng-container>
    </section>
  `
})
export class DepartamentoDetallePageComponent implements OnInit {
  detalle?: DepartamentoDetalleResponse;
  loading = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly departamentosApiService: DepartamentosApiService
  ) {}

  ngOnInit(): void {
    const departamentoId = Number(this.route.snapshot.paramMap.get('id'));

    if (!departamentoId) {
      this.errorMessage = 'Id de departamento inválido.';
      return;
    }

    this.loading = true;
    this.departamentosApiService.getDetalle(departamentoId).subscribe({
      next: (response) => {
        this.detalle = response;
        this.loading = false;
      },
      error: (error: { message?: string }) => {
        this.errorMessage = error.message ?? 'No se pudo cargar el detalle del departamento.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/departamentos']);
  }
}
