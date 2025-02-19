import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { TranslateService } from '@ngx-translate/core';
import { Util } from '../../views/shared/utils/util';
import { LoginType } from 'src/app/core/domain/enums/login-type.enum';
import { LoginUseCase } from 'src/app/core/use-cases/auth/login.use-case';
import { Login } from 'src/app/core/domain/entities/login.entity';
import { LoginBuilder } from 'src/app/core/domain/builders/login.builder';
import { LoginMapper } from 'src/app/infrastructure/mappers/login.mapper';
import { finalize } from 'rxjs/operators';
import { SetCacheUseCase } from 'src/app/core/use-cases/cache/set-cache.use-case';
import { SetCache } from 'src/app/core/domain/interfaces/set-cache.interface';
import { User } from 'src/app/core/domain/entities/user.entity';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';
import { StorageType } from 'src/app/core/domain/enums/storage-type.enum';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginType = LoginType;
    hide = true;
    loginControl: FormGroup;
    user: SocialUser;
    loggedIn: boolean;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private translate: TranslateService,
        private loginUseCase: LoginUseCase,
        private SetCacheUseCase: SetCacheUseCase,
    ) {
        this.loginControl = this.fb.group({
            email: '',
            password: '',
            keepLogin: [false]
        });
    }

    ngOnInit(): void {
    }

    login(loginType: LoginType): void {
        Util.loadingScreen();
        const login: Login = LoginBuilder.builder()
            .copyFrom(LoginMapper.toEntity(this.loginControl.value))
            .setLoginType(loginType)
            .build();

        this.loginUseCase.execute(login)
            .pipe(finalize(() => Util.stopLoading()))
            .subscribe(
                (user) => {
                    if (user?.id) {
                        this.router.navigateByUrl('/feed');
                    } else {
                        const setCache: SetCache<User> = { value: user, storageItem: StorageItem.REGISTERING_USER };
                        this.SetCacheUseCase.execute(setCache, StorageType.LOCAL_STORAGE);
                        this.router.navigateByUrl('/cadastro');
                    }
                },
                (err) => this.errorLogin(err),
            );
    }

    private errorLogin(err): void {
        if (err.error.message) {
            let codMessage = '';
            if (err.error.message.includes('AT001')) {
                codMessage = 'AT001';
            }
            if (codMessage) {
                this.translate.get('MESSAGE_ERROR.' + codMessage).subscribe(message => {
                    Util.showErrorDialog(message);
                });
            } else {
                this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                    Util.showErrorDialog(message);
                });
                console.log('error login', err);
            }
        } else {
            this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                Util.showErrorDialog(message);
            });
        }
    }
}
