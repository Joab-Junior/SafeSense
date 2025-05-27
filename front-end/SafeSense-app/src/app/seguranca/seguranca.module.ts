import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SegurancaPageRoutingModule } from './seguranca-routing.module';

import { SegurancaPage } from './seguranca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SegurancaPageRoutingModule
  ],
  declarations: [SegurancaPage]
})
export class SegurancaPageModule {}
