import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartamentoResponse } from '../../services/departamentos-api.service';
import { EmpleadoRequest } from '../../services/empleados-api.service';

export interface EmpleadoFormValue extends EmpleadoRequest {
  clave?: string;
}

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label for="nombre">Nombre</label>
      <input id="nombre" formControlName="nombre" type="text" />

      <label for="direccion">Dirección</label>
      <input id="direccion" formControlName="direccion" type="text" />

      <label for="telefono">Teléfono</label>
      <input id="telefono" formControlName="telefono" type="text" />

      <label for="departamentoId">Departamento</label>
      <select id="departamentoId" formControlName="departamentoId">
        <option [ngValue]="null" disabled>Seleccione un departamento</option>
        <option *ngFor="let dept of departamentos" [ngValue]="dept.id">{{ dept.nombre }}</option>
      </select>

      <button type="submit" [disabled]="form.invalid">Guardar empleado</button>
      <button type="button" (click)="cancel.emit()">Cancelar</button>
    </form>
  `
})
export class EmpleadoFormComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input() departamentos: DepartamentoResponse[] = [];
  @Input() initialValue?: EmpleadoFormValue;

  @Output() save = new EventEmitter<EmpleadoFormValue>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.maxLength(100)]],
    telefono: ['', [Validators.required, Validators.maxLength(100)]],
    departamentoId: [null as number | null, [Validators.required]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && this.initialValue) {
      this.form.patchValue({
        nombre: this.initialValue.nombre,
        direccion: this.initialValue.direccion,
        telefono: this.initialValue.telefono,
        departamentoId: this.initialValue.departamentoId
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();
    const payload: EmpleadoFormValue = {
      clave: this.initialValue?.clave,
      nombre: rawValue.nombre ?? '',
      direccion: rawValue.direccion ?? '',
      telefono: rawValue.telefono ?? '',
      departamentoId: rawValue.departamentoId ?? 0
    };

    this.save.emit(payload);
  }
}
