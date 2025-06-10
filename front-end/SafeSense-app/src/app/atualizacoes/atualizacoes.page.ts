import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-atualizacoes',
  templateUrl: './atualizacoes.page.html',
  styleUrls: ['./atualizacoes.page.scss'],
  standalone: false,
})
export class AtualizacoesPage implements OnInit {

  constructor(private navCtrl: NavController) { }
    
    goBack() {
      this.navCtrl.back();
    }

  
    ngOnInit() {
      
    }

}
