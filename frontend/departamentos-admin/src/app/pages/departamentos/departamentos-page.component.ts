import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DepartamentoRequest,
  DepartamentoResponse,
  DepartamentosApiService
} from '../../services/departamentos-api.service';

@Component({
  selector: 'app-departamentos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <h1>Departamentos</h1>

      <p *ngIf="errorMessage">{{ errorMessage }}</p>

      <form [formGroup]="form" (ngSubmit)="save()" data-cy="departamento-form">
        <label for="nombre">Nombre</label>
        <input id="nombre" type="text" formControlName="nombre" data-cy="departamento-nombre" />

        <label for="descripcion">Descripción</label>
        <input id="descripcion" type="text" formControlName="descripcion" data-cy="departamento-descripcion" />

        <button type="submit" [disabled]="form.invalid || loading" data-cy="departamento-submit">
          {{ editingDepartamentoId ? 'Actualizar' : 'Crear' }}
        </button>
        <button type="button" (click)="resetForm()" [disabled]="loading" data-cy="departamento-reset">Limpiar</button>
      </form>

      <ul *ngIf="!loading" data-cy="departamentos-list">
        <li *ngFor="let dept of departamentos">
          <strong>{{ dept.nombre }}</strong>
          <span> - {{ dept.descripcion || 'Sin descripción' }}</span>
          <button type="button" (click)="startEdit(dept)" data-cy="departamento-edit">Editar</button>
          <button type="button" (click)="remove(dept)" data-cy="departamento-delete">Eliminar</button>
          <button type="button" (click)="goToDetalle(dept.id)" data-cy="departamento-detalle">Ver detalle</button>
        </li>
      </ul>

      <p *ngIf="loading">Cargando...</p>
      <p *ngIf="!loading && departamentos.length === 0">No hay departamentos creados.</p>
    </section>
  `
})
export class DepartamentosPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: ['', [Validators.maxLength(255)]]
  });

  departamentos: DepartamentoResponse[] = [];
  editingDepartamentoId?: number;
  loading = false;
  errorMessage = '';

  constructor(
    private readonly departamentosApiService: DepartamentosApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartamentos();
  }

  loadDepartamentos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.departamentosApiService.list().subscribe({
      next: (response) => {
        this.departamentos = response;
        this.loading = false;
      },
      error: (error: { message?: string }) => {
        this.errorMessage = error.message ?? 'No se pudo cargar el listado de departamentos.';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const request: DepartamentoRequest = {
      nombre: value.nombre,
      descripcion: value.descripcion?.trim() ? value.descripcion : null
    };

    this.loading = true;
    const operation = this.editingDepartamentoId
      ? this.departamentosApiService.update(this.editingDepartamentoId, request)
      : this.departamentosApiService.create(request);

    operation.subscribe({
      next: () => {
        this.resetForm();
        this.loadDepartamentos();
      },
      error: (error: { message?: string }) => {
        this.errorMessage = error.message ?? 'No se pudo guardar el departamento.';
        this.loading = false;
      }
    });
  }

  startEdit(departamento: DepartamentoResponse): void {
    this.editingDepartamentoId = departamento.id;
    this.form.patchValue({
      nombre: departamento.nombre,
      descripcion: departamento.descripcion ?? ''
    });
  }

  remove(departamento: DepartamentoResponse): void {
    this.loading = true;
    this.errorMessage = '';

    this.departamentosApiService.delete(departamento.id).subscribe({
      next: () => {
        this.loadDepartamentos();
      },
      error: (error: { message?: string }) => {
        this.errorMessage = error.message ?? 'No se pudo eliminar el departamento.';
        this.loading = false;
      }
    });
  }

  goToDetalle(departamentoId: number): void {
    void this.router.navigate(['/departamentos', departamentoId]);
  }

  resetForm(): void {
    this.editingDepartamentoId = undefined;
    this.form.reset({
      nombre: '',
      descripcion: ''
    });
  }
}
