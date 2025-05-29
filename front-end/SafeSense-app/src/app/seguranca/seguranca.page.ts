import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController,  Platform, NavController,} from '@ionic/angular';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { Router } from '@angular/router';
import { DeleteAccountHandleService } from '../services/AccountHandle/AccountDeletion/delete-account-handle.service';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';

@Component({
  selector: 'app-seguranca',
  templateUrl: './seguranca.page.html',
  styleUrls: ['./seguranca.page.scss'],
  standalone: false,
  providers: [FingerprintAIO],
})
export class SegurancaPage implements OnInit {

  locationEnabled = true;
  notificationsEnabled = true;
  biometricEnabled = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private platform: Platform,
    private faio: FingerprintAIO,
    private alertController: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private deleteAccountHandler: DeleteAccountHandleService,
    private authService: AccountAuthHandleService
  ) {}

  async changePassword() {
    const alert = await this.alertCtrl.create({
      header: 'Alterar Senha',
      inputs: [
        { name: 'current', type: 'password', placeholder: 'Senha atual' },
        { name: 'new', type: 'password', placeholder: 'Nova senha' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: data => {
            const storedPassword = localStorage.getItem('password');
            if (data.current === storedPassword) {
              localStorage.setItem('password', data.new);
              this.presentToast('Senha alterada com sucesso');
            } else {
              this.presentToast('Senha atual incorreta');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async VPP() {
    const alert = await this.alertController.create({
      header: 'Política de Privacidade',
      subHeader: 'Última atualização: [25/05/2025]',
      message: 'Este aplicativo ("Aplicativo") foi desenvolvido com o objetivo de alertar usuários sobre possíveis vazamentos de gás. A sua privacidade é importante para nós. Esta Política de Privacidade descreve como suas informações são coletadas, usadas e protegidas.',
      buttons: ['OK']
    });

    await alert.present();
  }

  

  exportData() {
    const userData = {
      nome: 'Usuário Exemplo',
      email: 'usuario@email.com',
      configuracoes: {
        localizacao: this.locationEnabled,
        notificacoes: this.notificationsEnabled,
        biometria: this.biometricEnabled,
      },
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus-dados.json';
    a.click();
    window.URL.revokeObjectURL(url);

    this.presentToast('Dados exportados');
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

  private async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  ngOnInit(): void {
    
  }
}
