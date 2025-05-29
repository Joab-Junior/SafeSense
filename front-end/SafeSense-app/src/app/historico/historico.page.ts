import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: false,
})
export class HistoricoPage implements OnInit {

  constructor(private navCtrl: NavController) { }
      
      voltar() {
        this.navCtrl.back();
      }


  ngOnInit() {
  }

}
