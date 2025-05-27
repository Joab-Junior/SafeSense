import { Component, OnInit } from '@angular/core';
import { AccountAuthHandleService, AuthAccountData } from '../services/AccountHandle/account-auth-handle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.entrarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async login() {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inicio']);
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
          this.router.navigate(['/inicio']);
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

}