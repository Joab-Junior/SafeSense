import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private router: Router) { }
  goBack() {
    this.navCtrl.back();
  }

  openSettings() {
    console.log('Abrir Configurações');
    this.router.navigate(['/configuracoes']);
  }

  abrirSeguranca() {
    console.log('Abrir Segurança');
  }

  abrirNotificacoes() {
    console.log('Abrir Notificações');
  }

  abrirInfoConta() {
    console.log('Abrir Informações da Conta');
  }


  voltarParaPrincipal() {
    // Redireciona para a tela principal
    this.navCtrl.navigateRoot('/home');
  }

  ngOnInit() {
  }

}
