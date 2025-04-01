import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordRoutingModule } from './password-routing.module';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { NovaSenhaComponent } from './nova-senha/nova-senha.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RecuperarSenhaComponent,
    NovaSenhaComponent,
  ],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),

    // Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ]
})
export class PasswordModule { }
