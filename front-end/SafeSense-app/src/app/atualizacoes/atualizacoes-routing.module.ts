import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtualizacoesPage } from './atualizacoes.page';

const routes: Routes = [
  {
    path: '',
    component: AtualizacoesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtualizacoesPageRoutingModule {}
