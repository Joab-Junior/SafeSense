import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/account-auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'entrar',
    loadChildren: () => import('./entrar/entrar.module').then( m => m.EntrarPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then( m => m.CadastroPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorio',
    loadChildren: () => import('./relatorio/relatorio.module').then( m => m.RelatorioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'chatbox',
    loadChildren: () => import('./chatbox/chatbox.module').then( m => m.ChatboxPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'atualizacoes',
    loadChildren: () => import('./atualizacoes/atualizacoes.module').then( m => m.AtualizacoesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'seguranca',
    loadChildren: () => import('./seguranca/seguranca.module').then( m => m.SegurancaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notificacoes',
    loadChildren: () => import('./notificacoes/notificacoes.module').then( m => m.NotificacoesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'informacoes',
    loadChildren: () => import('./informacoes/informacoes.module').then( m => m.InformacoesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuracoes',
    loadChildren: () => import('./configuracoes/configuracoes.module').then( m => m.ConfiguracoesPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
