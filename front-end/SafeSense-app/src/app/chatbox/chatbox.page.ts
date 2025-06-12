import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.page.html',
  styleUrls: ['./chatbox.page.scss'],
  standalone: false,
})


export class ChatPage {

  respostasProntas = [
    {
      pergunta: 'Como saberei se há um vazamento de gás na minha casa?',
      resposta: 'Assim que ocorre um vazamento de gás glp, o sensor MQ-4 o detecta, acionando simultaneamente o LED e o buzzer passivo, gerando um alerta presencial. Além disso, a notificação de alerta é enviada pelo WhatsApp e para o aplicativo.',
      expandido: false,
    },
    {
      pergunta: 'O que devo fazer ao suspeitar de um vazamento de gás?',
      resposta: 'Abra portas e janelas imediatamente; Não acenda luzes, faíscas ou chamas; Feche o registro de gás, se possível; Saia do local e ligue para a emergência ou empresa responsável pelo fornecimento de gás.',
      expandido: false
    },
    {
      pergunta: 'O aplicativo envia alertas em tempo real?',
      resposta: 'Sim, se você tiver um sensor de gás conectado ao nosso sistema, os alertas são enviados em tempo real por notificações no aplicativo.',
      expandido: false
    },
    {
      pergunta: 'O que acontece se eu estiver fora de casa durante o vazamento?',
      resposta: 'Você será alertado imediatamente pelo nosso sistema. Isso permite que você acione vizinhos, familiares ou serviços de emergência mesmo à distância.',
      expandido: false
    }
  ];


  constructor() { }

  ngOnInit() { }

  toggleResposta(index: number) {
    this.respostasProntas[index].expandido = !this.respostasProntas[index].expandido;
  }

}
// 'Como saberei se há um vazamento de gás na minha casa?',
//     'O que devo fazer ao suspeitar de um vazamento de gás?',
//     'O site envia alertas em tempo real?',
//     'Preciso ter um sensor para usar o site?',
