import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cohetes',
    loadComponent: () =>
      import('./cohetes/cohetes/cohetes.component').then((m) => m.CohetesComponent),
  },
  {
    path: 'lanzamientos',
    loadComponent: () =>
      import('./lanzamientos/lanzamientos/lanzamientos.component').then((m) => m.LanzamientosComponent),
  },
  { path: '', redirectTo: 'cohetes', pathMatch: 'full' },
];
