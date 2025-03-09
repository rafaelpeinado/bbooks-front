import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthConfirmUseCase } from 'src/app/core/use-cases/auth/auth-confirm.use-case';
import { Login } from 'src/app/core/domain/entities/login.entity';

@Component({
  selector: 'app-auth-confirm',
  templateUrl: './auth-confirm.component.html',
  styleUrls: ['./auth-confirm.component.scss']
})
export class AuthConfirmComponent implements OnInit {
  confirmControl: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authConfirmUseCase: AuthConfirmUseCase,
  ) {
    this.confirmControl = this.fb.group({
      email: '',
      password: '',
      keepLogin: [false]
    });
  }

  ngOnInit(): void {
  }

  confirm(): void {
    const login: Login = this.confirmControl.value;
    this.authConfirmUseCase.execute(login).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
