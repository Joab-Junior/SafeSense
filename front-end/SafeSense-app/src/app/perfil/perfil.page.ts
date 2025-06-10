import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { UserInformationHandleService, ProfileResponse } from '../services/UserService/user-information-handle.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {

  userName: string = '';
  userEmail: string = '';

  constructor(private alertCtrl: AlertController, private navCtrl: NavController, private router: Router, private userService: UserInformationHandleService) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (res: ProfileResponse) => {
        if (res.status === 'success') {
          this.userName = res.data.nome;
          this.userEmail = res.data.email;
        } else {
          console.error('Erro ao carregar perfil:', res.message);
        }
      },
      error: err => {
        console.error('Erro na requisição do perfil:', err);
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }

}