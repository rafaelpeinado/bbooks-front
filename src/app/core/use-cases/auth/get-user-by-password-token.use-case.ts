import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { LoginServiceFactory } from 'src/app/infrastructure/adapters/factories/login-service.factory';
import { LoginType } from '../../domain/enums/login-type.enum';
import { Observable } from 'rxjs';
import { User } from '../../domain/entities/user.entity';

@Injectable({
    providedIn: 'root'
})
export class GetUserByPasswordTokenUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private readonly loginServiceFactory: LoginServiceFactory,
    ) { }

    execute(token: string): Observable<User> {
        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        return service.getUserByPasswordToken(token);
    }
}
