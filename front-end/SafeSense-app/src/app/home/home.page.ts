import { Component } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor() { }

  async testNotification() {
    if (!isPlatform('hybrid')) {
      console.warn('Ambiente não é híbrido');
      return;
    }

    const permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') {
      const request = await LocalNotifications.requestPermissions();
      if (request.display !== 'granted') {
        console.warn('Permissão de notificação negada');
        return;
      }
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999,
          title: '🔔 Notificação de Teste',
          body: 'Se você está vendo isso, as notificações funcionam!',
          schedule: { at: new Date(Date.now() + 1000) },
        }
      ]
    });
  }

}
