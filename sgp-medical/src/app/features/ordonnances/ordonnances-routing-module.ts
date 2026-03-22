import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdonnanceListComponent } from './components/ordonnance-list/ordonnance-list';

const routes: Routes = [
  { path: '', component: OrdonnanceListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdonnancesRoutingModule {}
