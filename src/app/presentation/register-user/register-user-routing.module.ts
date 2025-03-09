import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { CadastroSegundaEtapaComponent } from './cadastro-segunda-etapa/cadastro-segunda-etapa.component';


const routes: Routes = [
  { path: 'cadastro', component: CadastroComponent },
  { path: 'continuar-cadastro', component: CadastroSegundaEtapaComponent },
  {
    path: 'confirm',
    loadChildren: () => import('./auth-confirm/auth-confirm.module').then(m => m.AuthConfirmModule)
  },
  { path: '', redirectTo: 'cadastro', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterUserRoutingModule { }
