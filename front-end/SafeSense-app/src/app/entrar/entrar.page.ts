import { Component, OnInit } from '@angular/core';
import { AccountAuthHandleService, AuthAccountData } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.page.html',
  styleUrls: ['./entrar.page.scss'],
  standalone: false,
})
export class EntrarPage implements OnInit {

  entrarForm!: FormGroup;

  constructor(
    private authService: AccountAuthHandleService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.entrarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.checkAuth()
  }

  async login() {

    if (this.authService.isAuthenticated()) {
      this.navCtrl.navigateRoot('/inicio', {
        animated: true,
        animationDirection: 'forward'
      });

    }

    const { email, password } = this.entrarForm.value;

    if (this.entrarForm.invalid) {
      this.showToast('Preencha todos os campos corretamente.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Entrando...',
      spinner: 'crescent'
    });
    await loading.present();

    const data: AuthAccountData = { email, password }

    this.authService.login(data).subscribe({
      next: async (res) => {
        await loading.dismiss();

        if (res.status === 'success') {
          console.log('Resposta do login:', res);
          this.showToast('Login realizado com sucesso!');
          this.navCtrl.navigateRoot('/inicio', {
            animated: true,
            animationDirection: 'forward'
          });

        } else {
          console.log('Resposta do login:', res);
          this.showToast(res.message || 'Erro no login.');
        }
      },
      error: async (err) => {
        await loading.dismiss();
        console.log('Resposta do login:', err);
        this.showToast(err.message || 'Erro desconhecido.');
      }
    });
  }

  async showToast(msg: string) {
    if (msg === 'Login realizado com sucesso!') {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  async checkAuth() {
    if (this.authService.isAuthenticated()) {
      const alert = await this.alertCtrl.create({
        header: 'Detectamos um usuário logado',
        message: 'Deseja sair ou voltar ao início?',
        buttons: [
          {
            text: 'Sair',
            role: 'destructive',
            handler: () => {
              this.authService.logout();
              this.navCtrl.navigateRoot('/', {
                animated: true,
                animationDirection: 'back'
              });
            }
          },
          {
            text: 'Voltar ao Início',
            handler: () => {
              this.navCtrl.navigateRoot('/inicio', {
                animated: true,
                animationDirection: 'forward'
              });
            }
          }
        ],
        backdropDismiss: false
      });

      await alert.present();
    }
  }
}