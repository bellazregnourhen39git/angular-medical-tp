import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list';
import { PatientFormComponent } from './components/patient-form/patient-form';
import { PatientDetailComponent } from './components/patient-detail/patient-detail';
import { formulaireNonSauvegardeGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  // Module 7: Route liste patients
  { path: '', component: PatientListComponent },

  // Module 7: Formulaire nouveau patient + CanDeactivate Guard
  {
    path: 'nouveau',
    component: PatientFormComponent,
    canDeactivate: [formulaireNonSauvegardeGuard]
  },

  // Module 7: Détail patient par :id (lecture ActivatedRoute)
  { path: ':id', component: PatientDetailComponent },

  // Module 7: Formulaire édition patient + CanDeactivate Guard
  {
    path: ':id/modifier',
    component: PatientFormComponent,
    canDeactivate: [formulaireNonSauvegardeGuard]
  },

  // Module 7: Dossier complet patient (onglet dossier)
  { path: ':id/dossier', component: PatientDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
