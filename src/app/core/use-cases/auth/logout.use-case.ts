import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { LoginServiceFactory } from 'src/app/infrastructure/adapters/factories/login-service.factory';
import { LoginType } from '../../domain/enums/login-type.enum';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SetIsLoggedUseCase } from './set-is-logged.use-case';
import { ClearCacheUseCase } from './clear-cache.use-case';

@Injectable({
    providedIn: 'root'
})
export class LogoutUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private readonly loginServiceFactory: LoginServiceFactory,
        private readonly setIsLoggedUseCase: SetIsLoggedUseCase,
        private readonly clearCacheUseCase: ClearCacheUseCase,
    ) { }

    execute(): Observable<void> {
        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        return service.logout().pipe(
            tap(() => {
                this.setIsLoggedUseCase.execute(false);
                this.clearCacheUseCase.execute();
            }),
        );
    }
}
