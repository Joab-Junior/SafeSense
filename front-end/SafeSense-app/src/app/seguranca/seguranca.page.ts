import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, Platform, NavController, } from '@ionic/angular';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { Router } from '@angular/router';
import { DeleteAccountHandleService } from '../services/AccountHandle/AccountDeletion/delete-account-handle.service';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ChangePasswordHandlerService } from '../services/AccountHandle/AccountPasswordChange/change-password-handler.service';

@Component({
  selector: 'app-seguranca',
  templateUrl: './seguranca.page.html',
  styleUrls: ['./seguranca.page.scss'],
  standalone: false,
  providers: [FingerprintAIO],
})
export class SegurancaPage implements OnInit {

  locationEnabled = false;
  notificationsEnabled = false;
  canToggle = true;
  biometricEnabled = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private platform: Platform,
    private faio: FingerprintAIO,
    private navCtrl: NavController,
    private router: Router,
    private deleteAccountHandler: DeleteAccountHandleService,
    private authService: AccountAuthHandleService,
    private changePasswordService: ChangePasswordHandlerService
  ) { }

  ngOnInit() {
    this.checkNotificationPermission();
  }

  doRefresh(event: any) {
    this.checkNotificationPermission();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

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
          handler: (data) => {
            if (!data.current || !data.new) {
              this.presentToast('Preencha todos os campos!', 'danger');
              return false;
            }

            this.changePasswordService.changePassword(data.current, data.new).subscribe({
              next: async (res) => {
                this.presentToast(res.message, 'success');
              },
              error: async (err) => {
                const msg = err?.error?.message || 'Erro ao alterar senha.';
                this.presentToast(msg, 'danger');
              },
            });

            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  async checkNotificationPermission() {
    const result = await LocalNotifications.checkPermissions();
    this.notificationsEnabled = result.display === 'granted';

    if (this.notificationsEnabled) {
      this.canToggle = false;
    } else {
      this.canToggle = true;
    }
  }

  async handleNotificationToggle() {
  const result = await LocalNotifications.requestPermissions();

  if (result.display === 'granted') {
    this.notificationsEnabled = true;
    this.canToggle = false;
    this.presentToast('Notificações ativadas com sucesso!', 'success');
  } else {
    this.notificationsEnabled = false;
    this.canToggle = true;
    console.warn('Usuário negou permissão');

    const alert = await this.alertCtrl.create({
      header: 'Permissão Negada',
      message: 'Parece que ouve algum problema ao ativar as notificações, ative manualmente caso precise!',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        },
      ]
    });

    await alert.present();
  }
}

  async VPP() {
    const alert = await this.alertCtrl.create({
      header: 'Política de Privacidade',
      subHeader: 'Última atualização: [25/05/2025]',
      message: 'Este aplicativo ("Aplicativo") foi desenvolvido com o objetivo de alertar usuários sobre possíveis vazamentos de gás. A sua privacidade é importante para nós. Esta Política de Privacidade descreve como suas informações são coletadas, usadas e protegidas.',
      buttons: ['OK']
    });

    await alert.present();
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

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }
}
