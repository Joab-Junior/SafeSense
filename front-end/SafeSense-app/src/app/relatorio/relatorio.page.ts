import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.page.html',
  styleUrls: ['./relatorio.page.scss'],
  standalone: false,
})
export class RelatorioPage implements OnInit {

  constructor(private navCtrl: NavController) { }
    
    voltar() {
      this.navCtrl.back();
    }

  ngOnInit() {
  }

}
