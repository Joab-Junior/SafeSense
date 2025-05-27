import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountAuthHandleService } from './services/AccountHandle/account-auth-handle.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent {

  constructor(
    private router: Router,
    private authService: AccountAuthHandleService
  ) {
    this.checkLoginStatus();
    this.initTokenManagement();
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
