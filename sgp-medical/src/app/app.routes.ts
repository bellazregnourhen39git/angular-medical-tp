import { Routes } from '@angular/router';
import { authGuard, dejaCnxGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./pages/connexion/connexion.component').then(m => m.ConnexionComponent),
    canActivate: [dejaCnxGuard]
  },
  {
    path: 'inscription',
    loadComponent: () => import('./pages/inscription/inscription.component').then(m => m.InscriptionComponent),
    canActivate: [dejaCnxGuard]
  },
  {
    path: 'patients',
    loadChildren: () => import('./features/patients/patients-module').then(m => m.PatientsModule),
    canActivate: [authGuard]
  },
  {
    path: 'consultations',
    loadChildren: () => import('./features/consultations/consultations-module').then(m => m.ConsultationsModule),
    canActivate: [authGuard]
  },
  {
    path: 'ordonnances',
    loadChildren: () => import('./features/ordonnances/ordonnances-module').then(m => m.OrdonnancesModule),
    canActivate: [authGuard]
  },
  {
    path: 'tableau-de-bord',
    loadChildren: () => import('./features/tableau-de-bord/tableau-de-bord-module').then(m => m.TableauDeBordModule),
    canActivate: [authGuard]
  },
  {
    path: '404',
    loadComponent: () => import('./pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
