import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalNotifications } from '@capacitor/local-notifications';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthHeaderService } from '../../HeaderService/auth-header.service';
import { isPlatform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertCheckService {
  private apiUrl = environment.apiUrl;
  private checkInterval = 5000;
  private pollingSubscription?: Subscription;
  private lastAlertId: number = 0;
  private checkAlertEndpoint = '/device/last-alert.php';
  private isChecking = false;

  constructor(private http: HttpClient, private headerService: AuthHeaderService, private alertCtrl: AlertController) { }

  startPolling(id_usuario: number) {

    const savedId = localStorage.getItem('last_alert_id');
    this.lastAlertId = savedId ? parseInt(savedId, 10) : 0;

    this.pollingSubscription = interval(this.checkInterval).subscribe(() => {
      this.checkAlerts(id_usuario);
    })
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  private checkAlerts(id_usuario: number) {
    if (this.isChecking) return;
    this.isChecking = true;

    this.http.post<any>(
      `${this.apiUrl}${this.checkAlertEndpoint}`,
      { id_usuario },
      { headers: this.headerService.getAppSecret() }
    ).subscribe({
      next: (response) => {

        if (response.status === 'success' && response.data) {
          const latest = response.data;

          if (latest.id_alerta > this.lastAlertId) {
            this.lastAlertId = latest.id_alerta;

            localStorage.setItem('last_alert_id', this.lastAlertId.toString());

            this.sendNotification(latest.nivel_gas, latest.st_alerta, latest.id_alerta);
          } else {
            console.log('⏸️ Nenhum novo alerta detectado.');
          }
        } else {
          console.log('⚠️ Nenhum dado de alerta encontrado ou resposta inválida');
        }
      },
      complete: () => {
        this.isChecking = false;
      },
      error: (err) => {
        console.error('❌ Erro ao consultar alerta:', err);
        this.isChecking = false;
      }
    });
  }


  private async sendNotification(nivel: string, status: string, id: number) {
    const alert = await this.alertCtrl.create({
      header: '⚠️ Alerta de Vazamento!',
      subHeader: `Nível: ${nivel}`,
      message: `Status: ${status}`,
      buttons: ['OK'],
    });
    await alert.present();

    if (!isPlatform('hybrid')) {
      console.warn('Notificação ignorada: ambiente não é híbrido');
      return;
    }

    const permission = await LocalNotifications.checkPermissions();

    if (permission.display !== 'granted') {
      const result = await LocalNotifications.requestPermissions();
      if (result.display !== 'granted') {
        console.warn('Permissão de notificação negada');
        return;
      }
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: id,
          title: '⚠️ Alerta de Vazamento!',
          body: `Nível: ${nivel} | Status: ${status}`,
          schedule: { at: new Date(Date.now() + 1000) }
        }
      ]
    });
  }
}