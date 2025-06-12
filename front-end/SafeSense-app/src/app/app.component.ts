import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountAuthHandleService } from './services/AccountHandle/AccounAuth/account-auth-handle.service';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertCheckService } from './services/DeviceService/AlertCheck/alert-check.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent {

  constructor(
    private router: Router,
    private authService: AccountAuthHandleService,
    private platform: Platform,
    private alertService: AlertCheckService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
    this.checkLoginStatus();
    this.initTokenManagement();

    // Escuta o login para controlar o polling de alertas
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        const userId = this.authService.getUserId();
        if (userId) {
          this.alertService.startPolling(userId);
        }
      } else {
        this.alertService.stopPolling();
      }
    });
  }

  async initializeApp() {
    await this.platform.ready();

    const permission = await LocalNotifications.checkPermissions();

    if (permission.display !== 'granted') {
      const alert = await this.alertCtrl.create({
        header: 'Notificações desativadas!',
        message: 'As notificações é uma parte essencial do aplicativo, sem ela, você não recebe alertas de vazamentos em tempo real! Ative manualmente caso necessário.',
        buttons: [
          {
            text: 'Cancelar',
            handler: async () => {
              // Exibe toast informando como ativar manualmente
              const toast = await this.toastCtrl.create({
                message: 'Você pode ativar as notificações nas configurações de segurança do aplicativo.',
                duration: 4000,
                position: 'bottom',
                color: 'warning',
              });

              await toast.present();
            },
            role: 'cancel',
          },
          {
            text: 'Ativar',
            handler: async () => {
              const result = await LocalNotifications.requestPermissions();
              if (result.display !== 'granted') {
                console.warn('Permissão para notificações foi negada pelo usuário.');

                // Exibe toast informando como ativar manualmente
                const toast = await this.toastCtrl.create({
                  message: 'Você pode ativar as notificações nas configurações de segurança do aplicativo.',
                  duration: 4000,
                  position: 'bottom',
                  color: 'warning',
                });

                await toast.present();
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  checkLoginStatus() {
    const token = this.authService.getToken();

    if (token && !this.authService.isTokenExpired()) {
      // Redireciona para a página inicial se o token for válido
      this.router.navigate(['/inicio']);
    } else {
      // Se não tiver token ou estiver expirado, manda para o login
      this.router.navigate(['/']);
    }
  }

  initTokenManagement() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.scheduleRefreshToken();
    }
  }
}