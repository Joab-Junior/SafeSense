import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtualizacoesPageRoutingModule } from './atualizacoes-routing.module';

import { AtualizacoesPage } from './atualizacoes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtualizacoesPageRoutingModule
  ],
  declarations: [AtualizacoesPage]
})
export class AtualizacoesPageModule {}
