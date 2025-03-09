import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthConfirmRoutingModule } from './auth-confirm-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthConfirmComponent } from './auth-confirm.component';


@NgModule({
  declarations: [
    AuthConfirmComponent,
  ],
  imports: [
    CommonModule,
    AuthConfirmRoutingModule,
    ReactiveFormsModule,

    // Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ]
})
export class AuthConfirmModule { }
