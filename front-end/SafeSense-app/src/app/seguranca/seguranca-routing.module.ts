import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SegurancaPage } from './seguranca.page';

const routes: Routes = [
  {
    path: '',
    component: SegurancaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SegurancaPageRoutingModule {}
