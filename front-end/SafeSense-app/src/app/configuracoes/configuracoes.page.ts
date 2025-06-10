import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, } from '@ionic/angular';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: false,
})
export class ConfiguracoesPage implements OnInit {
  darkMode = false;

  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private authService: AccountAuthHandleService) { }


  async logout() {
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
            this.goBackToHome();
          },
        },
      ],
    });

    await alert.present();
  }

  goBackToHome() {
    // Redireciona para a tela principal
    this.navCtrl.navigateRoot('/home');
  }

  async aboutApp() {
    const alert = await this.alertCtrl.create({
      header: 'Sobre o App',
      message: 'Este aplicativo foi desenvolvido para funcionar em conjunto com um sistema de detecção de gás baseado em Arduino. Ele tem como principal objetivo monitorar ambientes residenciais, comerciais ou industriais em tempo real e alertar o usuário imediatamente em caso de vazamento de gás inflamável ou tóxico.',
      buttons: [
        { text: 'OK', role: 'cancel' }
      ],
    });

    await alert.present();
  }

  ngOnInit() {
  }

}
