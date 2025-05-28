import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: false,
})
export class ConfiguracoesPage implements OnInit {
  darkMode = false;


  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private authService: AccountAuthHandleService
  ) { }

  voltar() {
    this.navCtrl.back();
  }

  abrirPerfil() {
    console.log('Ir para conta');
    this.navCtrl.navigateForward('/perfil');
  }

  abrirTemas() {
    console.log('Ir para temas');
  }

  abrirNotificacoes() {
    console.log('Ir para notificações');
  }

  abrirIdioma() {
    console.log('Ir para idiomas');
  }

  abrirPrivacidade() {
    console.log('Ir para privacidade e segurança');
  }

  abrirSobre() {
    console.log('Ir para sobre o app');
  }

  async sair() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: 'Tem certeza que sair de sua conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          role: 'destructive',
          handler: () => {
            console.log('Você saiu de sua conta!');
            this.authService.logout();
            this.voltarParaPrincipal();
          },
        },
      ],
    });

    await alert.present();
  }

  voltarParaPrincipal() {
    // Redireciona para a tela principal
    this.navCtrl.navigateRoot('/home');
  }

  ngOnInit() {
  }

}
