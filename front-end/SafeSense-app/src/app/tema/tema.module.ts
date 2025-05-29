import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemaPageRoutingModule } from './tema-routing.module';

import { TemaPage } from './tema.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TemaPageRoutingModule
  ],
  declarations: [TemaPage]
})
export class TemaPageModule {}
