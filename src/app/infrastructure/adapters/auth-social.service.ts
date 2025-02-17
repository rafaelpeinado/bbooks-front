import { Injectable } from "@angular/core";
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from "angularx-social-login";
import { from, Observable } from "rxjs";
import { Login } from "src/app/core/domain/entities/login.entity";
import { User } from "src/app/core/domain/entities/user.entity";
import { LoginType } from "src/app/core/domain/enums/login-type.enum";
import { AuthRepository } from "src/app/core/repositories/auth.repository";
import { UserService } from "./user.service";
import { switchMap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthSocialService implements AuthRepository {

    constructor(
        private authServiceSocial: SocialAuthService,
        private userService: UserService,
    ) { }

    login(login: Login): Observable<User> {
        const loginProvider = login.loginType === LoginType.GOOGLE ? GoogleLoginProvider : FacebookLoginProvider
        return from(this.authServiceSocial.signIn(loginProvider.PROVIDER_ID)).pipe(
            switchMap((socialUser) => this.userService.getUserByEmail(socialUser.email)),
        );
    }
}
