import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DepartamentosPageComponent } from './pages/departamentos/departamentos-page.component';
import { DepartamentoDetallePageComponent } from './pages/departamento-detalle/departamento-detalle-page.component';
import { EmpleadosPageComponent } from './pages/empleados/empleados-page.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'departamentos',
    component: DepartamentosPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'empleados',
    component: EmpleadosPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'departamentos/:id',
    component: DepartamentoDetallePageComponent,
    canActivate: [AuthGuard]
  },
  { path: '', pathMatch: 'full', redirectTo: 'departamentos' },
  { path: '**', redirectTo: 'departamentos' }
];
