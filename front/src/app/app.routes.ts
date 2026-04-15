import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cohetes',
    loadComponent: () =>
      import('./cohetes/cohetes/cohetes.component').then((m) => m.CohetesComponent),
  },
  { path: '', redirectTo: 'cohetes', pathMatch: 'full' },
];
