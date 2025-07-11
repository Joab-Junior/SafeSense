import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatboxPageRoutingModule } from './chatbox-routing.module';

import { ChatPage } from './chatbox.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatboxPageRoutingModule
  ],
  declarations: [ChatPage]
})
export class ChatboxPageModule {}
