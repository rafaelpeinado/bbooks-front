import { Injectable } from '@angular/core';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Login } from 'src/app/core/domain/entities/login.entity';
import { User } from 'src/app/core/domain/entities/user.entity';
import { LoginType } from 'src/app/core/domain/enums/login-type.enum';
import { AuthRepository } from 'src/app/core/repositories/auth.repository';
import { UserService } from './user.service';
import { switchMap } from 'rxjs/operators';
import { SocialUserMapper } from '../mappers/social-user.mapper';

@Injectable({
    providedIn: 'root'
})
export class AuthSocialService implements AuthRepository {

    constructor(
        private authServiceSocial: SocialAuthService,
        private userService: UserService,
    ) { }

    loginByGoogle(user: User): Observable<User> {
        throw new Error('Method not implemented.');
    }

    changePassword(login: Login): Observable<User> {
        throw new Error('Method not implemented.');
    }

    sendEmailResetPassword(input: { email: string; url: string }): Observable<string> {
        throw new Error('Method not implemented.');
    }

    getUserByPasswordToken(token: string): Observable<User> {
        throw new Error('Method not implemented.');
    }

    loginByToken(login: Login): Observable<User> {
        throw new Error('Method not implemented.');
    }

    getIsLogged(): BehaviorSubject<boolean> {
        throw new Error('Method not implemented.');
    }

    setIsLogged(isLogged: boolean): void {
        throw new Error('Method not implemented.');
    }


    logout(): Observable<void> {
        return this.authServiceSocial.authState.pipe(
            switchMap((socialUser) => {
                if (socialUser) {
                    return from(this.authServiceSocial.signOut());
                }
                return of(undefined);
            })
        );
    }

    login(login: Login): Observable<User> {
        const loginProvider = login.loginType === LoginType.GOOGLE ? GoogleLoginProvider : FacebookLoginProvider;
        return from(this.authServiceSocial.signIn(loginProvider.PROVIDER_ID)).pipe(
            switchMap((socialUser) => {
                return this.userService.getUserByEmail(socialUser.email).pipe(
                    switchMap((user) => {
                        if (user.id) {
                            return of(user);
                        }
                        return of(SocialUserMapper.toEntity(socialUser));
                    })
                );
            }),
        );
    }
}
