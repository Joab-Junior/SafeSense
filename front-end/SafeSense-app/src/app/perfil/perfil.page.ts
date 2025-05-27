import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  constructor(private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }
  voltar() {
    this.navCtrl.back();
  }
  
  abrirConfiguracoes() {
    console.log('Abrir Configurações');
    // Navegação ou lógica
  }

  abrirSeguranca() {
    console.log('Abrir Segurança');
  }

  abrirNotificacoes() {
    console.log('Abrir Notificações');
  }

  abrirInfoConta() {
    console.log('Abrir Informações da Conta');
  }

  async deletarConta() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: 'Tem certeza que deseja deletar sua conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Deletar',
          role: 'destructive',
          handler: () => {
            console.log('Conta deletada!');
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
