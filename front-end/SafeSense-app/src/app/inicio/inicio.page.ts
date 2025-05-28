import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {

  constructor(private navCtrl: NavController, private authService: AccountAuthHandleService) { }
  
  goBack() {
    if (!this.authService.getToken) {
      this.navCtrl.back();
    }
  }

  ngOnInit() {
  }

}
