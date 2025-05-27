import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {

  constructor(private navCtrl: NavController) { }
  
  voltar() {
    this.navCtrl.back();
  }

  ngOnInit() {
  }

}
