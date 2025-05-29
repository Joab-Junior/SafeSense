import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.page.html',
  styleUrls: ['./notificacoes.page.scss'],
  standalone: false,
})
export class NotificacoesPage implements OnInit {

  
  
  notificacoesAtivas = true;
  somAtivo = true;
  vibracaoAtiva = true;

  constructor(private navCtrl: NavController) { }
    
    voltar() {
      this.navCtrl.back();
    }

  ngOnInit() {
    this.carregarConfiguracoes();
  }
  carregarConfiguracoes() {
    this.notificacoesAtivas = JSON.parse(localStorage.getItem('notificacoesAtivas') || 'true');
    this.somAtivo = JSON.parse(localStorage.getItem('somAtivo') || 'true');
    this.vibracaoAtiva = JSON.parse(localStorage.getItem('vibracaoAtiva') || 'true');
  }

  salvarConfiguracoes() {
    localStorage.setItem('notificacoesAtivas', JSON.stringify(this.notificacoesAtivas));
    localStorage.setItem('somAtivo', JSON.stringify(this.somAtivo));
    localStorage.setItem('vibracaoAtiva', JSON.stringify(this.vibracaoAtiva));
  }
}
