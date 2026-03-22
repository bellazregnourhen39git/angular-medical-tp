import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationListComponent } from './components/consultation-list/consultation-list';

const routes: Routes = [
  { path: '', component: ConsultationListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationsRoutingModule {}
