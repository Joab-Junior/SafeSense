import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';
import { AlertHistoryService } from '../services/DeviceService/AlertHistory/alert-history.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {
  alerts: any[] = [];

  constructor(
    private navCtrl: NavController,
    private authService: AccountAuthHandleService,
    private alertHistoryService: AlertHistoryService
  ) { }

  ngOnInit() {
    this.listAlerts()
  }

  goBack() {
    if (!this.authService.getToken) {
      this.navCtrl.navigateRoot('/', {
        animated: true,
        animationDirection: 'back'
      });
    }
  }

  doRefresh(event: any) {
    this.listAlerts();
    event.target.complete();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  listAlerts() {
    const id_usuario = this.authService.getUserId();

    if (id_usuario === null) {
      console.error('ID do usuário não encontrado!');
      return;
    }

    this.alertHistoryService.getAlertHistory(id_usuario).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.alerts = (response.data || []).slice(0, 3);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar alertas: ', err);
      }
    });
  }

}
