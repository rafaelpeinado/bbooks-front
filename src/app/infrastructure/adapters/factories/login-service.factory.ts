import { Injectable } from "@angular/core";
import { AuthRepository } from "src/app/core/repositories/auth.repository";
import { AuthApiService } from "../auth.service";
import { AuthSocialService } from "../auth-social.service";
import { FactoryApi } from "./factory.factory";
import { LoginType } from "src/app/core/domain/enums/login-type.enum";

@Injectable({
    providedIn: 'root'
})
export class LoginServiceFactory extends FactoryApi<AuthRepository> {

    constructor(
        private authService: AuthApiService,
        private authSocialService: AuthSocialService,
    ) {
        super();
    }

    public create(loginType: LoginType): AuthRepository {
        if (loginType === LoginType.BBOOKS) {
            return this.authService;
        }
        return this.authSocialService;
    }
}
