import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { LoginServiceFactory } from 'src/app/infrastructure/adapters/factories/login-service.factory';
import { LoginType } from '../../domain/enums/login-type.enum';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SendEmailResetPasswordUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private loginServiceFactory: LoginServiceFactory,
    ) { }

    execute(input: { email: string; url: string }): Observable<string> {
        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        return service.sendEmailResetPassword(input);
    }
}
