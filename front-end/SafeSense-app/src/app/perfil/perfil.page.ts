import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { DeleteAccountHandleService } from '../services/AccountHandle/AccountDeletion/delete-account-handle.service';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private toastCtrl: ToastController,
    private deleteAccountHandler: DeleteAccountHandleService,
    private authService: AccountAuthHandleService
  ) { }
  goBack() {
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

  async confirmExclution() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: 'Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Deletar',
          role: 'destructive',
          handler: () => {
            console.log('Conta deletada!');
            this.deleteAccount();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteAccount() {
    // Redireciona para a tela principal
    this.deleteAccountHandler.deleteAccount().subscribe({
      next: async () => {
        this.authService.logout();

        await this.router.navigate(['/']);
        const toast = await this.toastCtrl.create({
          message: 'Conta deletada com sucesso.',
          duration: 2000,
          color: 'success'
        });
        toast.present()
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: err.message || 'Erro ao deletar conta.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  ngOnInit() {
  }

}
