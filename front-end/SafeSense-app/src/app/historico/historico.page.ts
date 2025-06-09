import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertHistoryService } from '../services/DeviceService/AlertHistory/alert-history.service';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: false,
})
export class HistoricoPage {
  alertas: any[] = [];

  constructor(private navCtrl: NavController, private alertHistoryService: AlertHistoryService, private authService: AccountAuthHandleService) { }

  goBack() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    const id_usuario = this.authService.getUserId();

    if (id_usuario === null) {
      console.error('ID do usuário não encontrado!');
      return;
    }

    this.alertHistoryService.getAlertHistory(id_usuario).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.alertas = response.data || [];
        }
      },
      error: (err) => {
        console.error('Erro ao carregar alertas: ', err);
      }
    })
  }

}
