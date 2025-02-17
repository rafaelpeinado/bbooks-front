import { Injectable } from "@angular/core";
import { UseCaseApiInterface } from "../use-case.interface";
import { LoginServiceFactory } from "src/app/infrastructure/adapters/factories/login-service.factory";
import { LoginType } from "../../domain/enums/login-type.enum";
import { Login } from "../../domain/entities/login.entity";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { SetIsLoggedUseCase } from "./set-is-logged.use-case";
import { CreateLoginCacheUseCase } from "./create-login-cache.use-case";
import { User } from "../../domain/entities/user.entity";

@Injectable({
    providedIn: 'root'
})
export class LoginByTokenUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private loginServiceFactory: LoginServiceFactory,
        private createLoginCacheUseCase: CreateLoginCacheUseCase,
        private setIsLoggedUseCase: SetIsLoggedUseCase,
    ) { }

    execute(login: Login): Observable<User> {
        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        return service.loginByToken(login).pipe(
            map((user) => {
                this.createLoginCacheUseCase.execute(user, login.loginType);
                this.setIsLoggedUseCase.execute(true);
                return user;
            }),
        );
    }
}