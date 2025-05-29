import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.page.html',
  styleUrls: ['./chatbox.page.scss'],
  standalone: false,
})


export class ChatPage {
  mensagens: { texto: string; autor: 'eu' | 'bot' }[] = [];
  novaMensagem = '';

  respostasProntas: string[] = [
    'Qual é o problema?',
    'Tem vazamento de gás?',
    'Preciso de ajuda urgente!',
    'Local já evacuado.',
    'Contato feito com suporte.'
  ];

  enviarMensagem(texto?: string) {
    const mensagem = texto || this.novaMensagem.trim();
    if (mensagem === '') return;

    this.mensagens.push({ texto: mensagem, autor: 'eu' });

    this.novaMensagem = '';

    setTimeout(() => {
      this.mensagens.push({ texto: 'Entendido. Estamos analisando.', autor: 'bot' });
    }, 1000);
  }

  constructor() { }

  ngOnInit() {
  }

}
