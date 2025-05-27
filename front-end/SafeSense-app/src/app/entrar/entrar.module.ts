import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntrarPageRoutingModule } from './entrar-routing.module';

import { EntrarPage } from './entrar.page';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntrarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EntrarPage]
})
export class EntrarPageModule {}
