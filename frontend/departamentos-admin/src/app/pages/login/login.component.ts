import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSessionService } from '../../services/auth-session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <h1>Iniciar sesión</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" data-cy="login-form">
        <label for="username">Usuario</label>
        <input id="username" type="text" formControlName="username" data-cy="login-email" />

        <label for="password">Contraseña</label>
        <input id="password" type="password" formControlName="password" data-cy="login-password" />

        <button type="submit" [disabled]="form.invalid" data-cy="login-submit">Entrar</button>
      </form>
    </section>
  `
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(
    private readonly authSessionService: AuthSessionService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.authSessionService.login(username, password);
    void this.router.navigate(['/departamentos']);
  }
}
