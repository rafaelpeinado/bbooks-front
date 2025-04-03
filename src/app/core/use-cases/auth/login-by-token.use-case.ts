import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { LoginServiceFactory } from 'src/app/infrastructure/adapters/factories/login-service.factory';
import { LoginType } from '../../domain/enums/login-type.enum';
import { Login } from '../../domain/entities/login.entity';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SetIsLoggedUseCase } from './set-is-logged.use-case';
import { CreateLoginCacheUseCase } from './create-login-cache.use-case';
import { User } from '../../domain/entities/user.entity';
import { GetCacheUseCase } from '../cache/get-cache.use-case';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';
import { StorageType } from '../../domain/enums/storage-type.enum';

@Injectable({
    providedIn: 'root'
})
export class LoginByTokenUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private readonly loginServiceFactory: LoginServiceFactory,
        private readonly createLoginCacheUseCase: CreateLoginCacheUseCase,
        private readonly setIsLoggedUseCase: SetIsLoggedUseCase,
        private readonly getCacheUseCase: GetCacheUseCase,
    ) { }

    execute(login: Login): Observable<User> {
        const loginTypeCached: LoginType = this.getCacheUseCase.execute<LoginType>(StorageItem.PROVIDER, StorageType.LOCAL_STORAGE);
        const loginType: LoginType = loginTypeCached ?? login.loginType;

        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        return service.loginByToken(login).pipe(
            map((user) => {
                this.createLoginCacheUseCase.execute(user, loginType);
                this.setIsLoggedUseCase.execute(true);
                return user;
            }),
        );
    }
}
