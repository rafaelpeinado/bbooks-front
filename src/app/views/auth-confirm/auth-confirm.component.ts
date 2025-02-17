import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthConfirmService } from '../../services/auth-confirm.service';
import { Router } from '@angular/router';
import { SetCacheUserUseCase } from 'src/app/core/use-cases/user/set-cache-user.use-case';
import { SetTokenUseCase } from 'src/app/core/use-cases/auth/set-token.use-case';
import { SetIsLoggedUseCase } from 'src/app/core/use-cases/auth/set-is-logged.use-case';
import { UserMapper } from 'src/app/infrastructure/mappers/user.mapper';
import { UserTO } from 'src/app/infrastructure/dtos/user.dto';

@Component({
  selector: 'app-auth-confirm',
  templateUrl: './auth-confirm.component.html',
  styleUrls: ['./auth-confirm.component.scss']
})
export class AuthConfirmComponent implements OnInit {
  confirmControl: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authConfirmService: AuthConfirmService,
    private router: Router,
    private setCacheUserUseCase: SetCacheUserUseCase,
    private setTokenUseCase: SetTokenUseCase,
    private setIsLoggedUseCase: SetIsLoggedUseCase,
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
    this.authConfirmService.confirm(this.confirmControl.value).subscribe(res => {
      this.setCacheUserUseCase.execute(UserMapper.toEntity(res as UserTO));
      this.setTokenUseCase.execute((res as UserTO).token);
      this.setIsLoggedUseCase.execute(this.confirmControl.value.keepLogin);
      this.router.navigateByUrl('/');
    },
      (err) => {
        alert(err.error.message);
      }
    );
  }

}
