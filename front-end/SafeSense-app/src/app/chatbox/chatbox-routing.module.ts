import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chatbox.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatboxPageRoutingModule {}
