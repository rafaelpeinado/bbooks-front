import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { LoginServiceFactory } from 'src/app/infrastructure/adapters/factories/login-service.factory';
import { LoginType } from '../../domain/enums/login-type.enum';
import { BehaviorSubject } from 'rxjs';
import { GetCachedUserUseCase } from '../user/get-cached-user.use-case';
import { User } from '../../domain/entities/user.entity';
import { SetIsLoggedUseCase } from './set-is-logged.use-case';
import { GetTokenUseCase } from './get-token.use-case';

@Injectable({
    providedIn: 'root'
})
export class GetIsLoggedUseCase implements UseCaseInterface {
    constructor(
        private loginServiceFactory: LoginServiceFactory,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private setIsLoggedUseCase: SetIsLoggedUseCase,
        private getTokenUseCase: GetTokenUseCase,
    ) { }

    execute(): BehaviorSubject<boolean> {
        const user: User = this.getCachedUserUseCase.execute();
        const token = this.getTokenUseCase.execute();

        const isLogged = !!user || !!token;
        this.setIsLoggedUseCase.execute(isLogged);

        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        return service.getIsLogged();
    }
}
