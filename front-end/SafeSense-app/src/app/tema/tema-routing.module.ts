import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemaPage } from './tema.page';

const routes: Routes = [
  {
    path: '',
    component: TemaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemaPageRoutingModule {}
