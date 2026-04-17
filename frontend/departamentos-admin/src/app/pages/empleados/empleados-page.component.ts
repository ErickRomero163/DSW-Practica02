import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { EmpleadoFormComponent, EmpleadoFormValue } from '../../components/empleado-form/empleado-form.component';
import { DepartamentoResponse, DepartamentosApiService } from '../../services/departamentos-api.service';
import { EmpleadoResponse, EmpleadosApiService } from '../../services/empleados-api.service';

@Component({
  selector: 'app-empleados-page',
  standalone: true,
  imports: [CommonModule, EmpleadoFormComponent],
  template: `
    <section>
      <h1>Empleados</h1>

      <p *ngIf="errorMessage">{{ errorMessage }}</p>
      <p *ngIf="loading">Cargando...</p>

      <app-empleado-form
        *ngIf="!loading"
        [departamentos]="departamentos"
        [initialValue]="editingEmpleado"
        (save)="save($event)"
        (cancel)="cancelEdit()"
      />

      <ul *ngIf="!loading">
        <li *ngFor="let empleado of empleados">
          <strong>{{ empleado.nombre }}</strong>
          <span> - {{ empleado.clave }}</span>
          <span> - {{ empleado.departamento.nombre }}</span>
          <button type="button" (click)="startEdit(empleado)">Editar</button>
          <button type="button" (click)="remove(empleado)">Eliminar</button>
        </li>
      </ul>

      <p *ngIf="!loading && empleados.length === 0">No hay empleados registrados.</p>
    </section>
  `
})
export class EmpleadosPageComponent implements OnInit {
  empleados: EmpleadoResponse[] = [];
  departamentos: DepartamentoResponse[] = [];
  editingEmpleado?: EmpleadoFormValue;
  loading = false;
  errorMessage = '';

  constructor(
    private readonly empleadosApiService: EmpleadosApiService,
    private readonly departamentosApiService: DepartamentosApiService
  ) {}

  ngOnInit(): void {
    this.reloadData();
  }

  save(value: EmpleadoFormValue): void {
    this.loading = true;
    this.errorMessage = '';

    const request = {
      nombre: value.nombre,
      direccion: value.direccion,
      telefono: value.telefono,
      departamentoId: value.departamentoId
    };

    const operation = value.clave
      ? this.empleadosApiService.update(value.clave, request)
      : this.empleadosApiService.create(request);

    operation.subscribe({
      next: () => {
        this.cancelEdit();
        this.reloadData();
      },
      error: (error: { message?: string }) => {
        this.errorMessage = error.message ?? 'No se pudo guardar el empleado.';
        this.loading = false;
      }
    });
  }

  startEdit(empleado: EmpleadoResponse): void {
    this.editingEmpleado = {
      clave: empleado.clave,
      nombre: empleado.nombre,
      direccion: empleado.direccion,
      telefono: empleado.telefono,
      departamentoId: empleado.departamento.id
    };
  }

  cancelEdit(): void {
    this.editingEmpleado = undefined;
  }

  remove(empleado: EmpleadoResponse): void {
    this.loading = true;
    this.errorMessage = '';

    this.empleadosApiService.delete(empleado.clave).subscribe({
      next: () => {
        this.reloadData();
      },
      error: (error: { message?: string }) => {
        this.errorMessage = error.message ?? 'No se pudo eliminar el empleado.';
        this.loading = false;
      }
    });
  }

  private reloadData(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      empleados: this.empleadosApiService.list(),
      departamentos: this.departamentosApiService.list()
    }).subscribe({
      next: ({ empleados, departamentos }) => {
        this.empleados = empleados;
        this.departamentos = departamentos;
        this.loading = false;
      },
      error: (error: { message?: string }) => {
        this.errorMessage = error.message ?? 'No se pudo cargar información de empleados.';
        this.loading = false;
      }
    });
  }
}