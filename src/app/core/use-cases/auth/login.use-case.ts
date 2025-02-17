import { Injectable } from "@angular/core";
import { UseCaseApiInterface } from "../use-case.interface";
import { LoginServiceFactory } from "src/app/infrastructure/adapters/factories/login-service.factory";
import { LoginType } from "../../domain/enums/login-type.enum";
import { Login } from "../../domain/entities/login.entity";
import { map } from "rxjs/operators";
import { SetCacheUserUseCase } from "../user/set-cache-user.use-case";
import { SetTokenUseCase } from "./set-token.use-case";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoginUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private loginServiceFactory: LoginServiceFactory,
        private setCacheUserUseCase: SetCacheUserUseCase,
        private setTokenUseCase: SetTokenUseCase,
    ) { }

    execute(login: Login): Observable<void> {
        const service = this.loginServiceFactory.create(login.loginType);
        return service.login(login).pipe(
            map((user) => {
                this.setCacheUserUseCase.execute(user);
                this.setTokenUseCase.execute(user.token);
                return;
            }),
        );
    }
}