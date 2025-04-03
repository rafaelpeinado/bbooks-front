import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { LoginServiceFactory } from 'src/app/infrastructure/adapters/factories/login-service.factory';
import { LoginType } from '../../domain/enums/login-type.enum';
import { Observable } from 'rxjs';
import { User } from '../../domain/entities/user.entity';
import { Login } from '../../domain/entities/login.entity';
import { LoginByTokenUseCase } from './login-by-token.use-case';
import { switchMap } from 'rxjs/operators';
import { LoginBuilder } from '../../domain/builders/login.builder';

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private readonly loginServiceFactory: LoginServiceFactory,
        private readonly LoginByTokenUseCase: LoginByTokenUseCase,
    ) { }

    execute(login: Login): Observable<User> {
        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        return service.changePassword(login).pipe(
            switchMap((user) => {
                const login: Login = LoginBuilder.builder()
                    .setEmail(user.email)
                    .setToken(user.token)
                    .build();
                return this.LoginByTokenUseCase.execute(login);
            })
        );
    }
}
