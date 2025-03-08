import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { LoginServiceFactory } from 'src/app/infrastructure/adapters/factories/login-service.factory';
import { LoginType } from '../../domain/enums/login-type.enum';
import { Observable } from 'rxjs';
import { User } from '../../domain/entities/user.entity';
import { Login } from '../../domain/entities/login.entity';
import { map } from 'rxjs/operators';
import { CreateLoginCacheUseCase } from './create-login-cache.use-case';
import { SetIsLoggedUseCase } from './set-is-logged.use-case';

@Injectable({
    providedIn: 'root'
})
export class AuthConfirmUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private readonly loginServiceFactory: LoginServiceFactory,
        private readonly createLoginCacheUseCase: CreateLoginCacheUseCase,
        private readonly setIsLoggedUseCase: SetIsLoggedUseCase,
    ) { }

    execute(login: Login): Observable<User> {
        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        return service.authConfirm(login).pipe(
            map((user) => {
                if (user?.id) {
                    this.createLoginCacheUseCase.execute(user, LoginType.BBOOKS);
                    this.setIsLoggedUseCase.execute(true);
                }
                return user;
            }),
        );
    }
}
