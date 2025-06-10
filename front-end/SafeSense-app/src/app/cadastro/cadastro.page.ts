import { Component, OnInit } from '@angular/core';
import { CreateAccountHandleService, CreateAccountData } from '../services/AccountHandle/AccountCreation/create-account-handle.service';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from 'src/utils/validators';
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: false, // Mantido conforme estrutura do projeto
})

export class CadastroPage implements OnInit {

  cadastroForm!: FormGroup;

  constructor(
    private createAccountService: CreateAccountHandleService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private authService: AccountAuthHandleService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.cadastroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }

  get senha() {
    return this.cadastroForm.get('password')?.value || '';
  }

  get errosSenha() {
    const control = this.cadastroForm.get('password');
    return control?.errors || {};
  }

  get temMinLength(): boolean {
    return this.senha.length >= 6;
  }

  get temMaiuscula(): boolean {
    return /[A-Z]/.test(this.senha);
  }

  get temMinuscula(): boolean {
    return /[a-z]/.test(this.senha);
  }

  get temNumero(): boolean {
    return /[0-9]/.test(this.senha);
  }

  get temEspecial(): boolean {
    return /[^A-Za-z0-9]/.test(this.senha);
  }

  async createAccount() {
    const { name, email, password, confirmPassword } = this.cadastroForm.value;

    if (password !== confirmPassword) {
      await this.presentToast('As senhas não coincidem!', 'danger');
      return;
    }

    if (this.cadastroForm.invalid) {
      await this.presentToast('Preencha todos os campos corretamente!', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Criando conta...' });
    await loading.present();

    const data: CreateAccountData = { name, email, password };

    console.log('Enviando dados para API:', data); // Para depuração

    this.createAccountService.createAccount(data).subscribe({
      next: async (res) => {
        console.log('Resposta da API:', res); // Log para depuração
        await loading.dismiss();
        if (res.status === 'success') {
          await this.presentToast('Conta criada com sucesso! Faça login.', 'success');
          this.navCtrl.navigateRoot('/entrar', {
            animated: true,
            animationDirection: 'back'
          }); // redireciona para a página de login
        } else {
          await this.presentToast(res.message || 'Erro ao criar conta.', 'danger');
        }
      },
      error: async (err) => {
        console.log('Erro ao criar conta:', err); // Log para depuração
        await loading.dismiss();
        await this.presentToast('Erro ao criar conta.', 'danger');
      }
    });
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