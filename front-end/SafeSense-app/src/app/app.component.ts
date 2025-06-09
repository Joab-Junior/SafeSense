import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountAuthHandleService } from './services/AccountHandle/AccounAuth/account-auth-handle.service';
import { Platform } from '@ionic/angular';
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
    private alertService: AlertCheckService
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
      const result = await LocalNotifications.requestPermissions();
      if (result.display !== 'granted') {
        console.warn('Permissão para notificações negada');
      }
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