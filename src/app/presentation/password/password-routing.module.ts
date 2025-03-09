import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { NovaSenhaComponent } from './nova-senha/nova-senha.component';


const routes: Routes = [
  {
    path: 'recuperar-senha', component: RecuperarSenhaComponent,
  },
  {
    path: 'nova-senha/:token', component: NovaSenhaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordRoutingModule { }
