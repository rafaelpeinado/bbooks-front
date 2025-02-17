import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { LoginServiceFactory } from "src/app/infrastructure/adapters/factories/login-service.factory";
import { LoginType } from "../../domain/enums/login-type.enum";

@Injectable({
    providedIn: 'root'
})
export class SetIsLoggedUseCase implements UseCaseInterface {
    constructor(private loginServiceFactory: LoginServiceFactory) { }

    execute(isLogged: boolean): void {
        const service = this.loginServiceFactory.create(LoginType.BBOOKS);
        service.setIsLogged(isLogged);
    }
}