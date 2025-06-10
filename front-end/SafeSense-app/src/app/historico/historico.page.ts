import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertHistoryService } from '../services/DeviceService/AlertHistory/alert-history.service';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: false,
})
export class HistoricoPage {
  alerts: any[] = [];

  constructor(
    private navCtrl: NavController,
    private alertHistoryService: AlertHistoryService,
    private authService: AccountAuthHandleService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  goBack() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    this.listAlerts();
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
          this.alerts = response.data || [];
        }
      },
      error: (err) => {
        console.error('Erro ao carregar alertas: ', err);
      }
    });
  }

  doRefresh(event: any) {
    this.listAlerts();
    event.target.complete();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  async confirmClearAlertHistory() {

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: 'Tem certeza que deseja apagar todos os alertas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Apagar',
          handler: () => this.clearAlertHistory()
        }
      ]
    });

    await alert.present();

  }

  async clearAlertHistory() {
    const loading = await this.loadingCtrl.create({
      message: 'Apagando alertas...',
      spinner: 'circles'
    });
    await loading.present();

    const id_usuario = this.authService.getUserId();

    if (id_usuario === null) {
      await loading.dismiss();
      console.error('ID do usuário não encontrado!');
      return;
    }

    localStorage.removeItem('last_alert_id');

    this.alertHistoryService.clearServerHistory(id_usuario).subscribe({
      next: async (res) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: res.message,
          duration: 3000,
          color: 'success'
        });
        toast.present();

        this.alerts = [];
      },
      error: async (err) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: 'Erro ao apagar alertas!',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
        console.error('Erro na exclusão: ', err);
      }
    });
  }

}
