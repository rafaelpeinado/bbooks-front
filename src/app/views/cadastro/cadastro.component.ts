import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CadastroService } from '../../services/cadastro-service.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/core/domain/entities/user.entity';
import { SocialUser } from 'angularx-social-login';
import { GetCacheUseCase } from 'src/app/core/use-cases/cache/get-cache.use-case';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';
import { StorageType } from 'src/app/core/domain/enums/storage-type.enum';
import { LoginByTokenUseCase } from 'src/app/core/use-cases/auth/login-by-token.use-case';
import { LoginBuilder } from 'src/app/core/domain/builders/login.builder';
import { Login } from 'src/app/core/domain/entities/login.entity';
import { SetCacheUserUseCase } from 'src/app/core/use-cases/user/set-cache-user.use-case';
import { RemoveCacheUseCase } from 'src/app/core/use-cases/cache/remove-cache.use-case';
import { UserTO } from 'src/app/infrastructure/dtos/user.dto';
import { Util } from '../shared/Utils/util';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.hasError('notSame') && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}

@Component({
    selector: 'app-cadastro',
    templateUrl: './cadastro.component.html',
    styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
    public user: User;
    public socialUser: SocialUser;

    hide = true;
    cadastroControl: FormGroup;

    matcher = new MyErrorStateMatcher();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private cadastroService: CadastroService,
        private translate: TranslateService,
        private getCacheUseCase: GetCacheUseCase,
        private removeCacheUseCase: RemoveCacheUseCase,
        private loginByTokenUseCase: LoginByTokenUseCase,
        private setCacheUserUseCase: SetCacheUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.user = this.getCacheUseCase.execute<User>(StorageItem.REGISTERING_USER, StorageType.LOCAL_STORAGE);

        this.createForm();
    }

    createForm() {
        this.cadastroControl = this.fb.group({
            name: [this.user?.name ? this.user.name : '', Validators.required],
            lastName: [this.user?.lastName ? this.user.lastName : '', Validators.required],
            email: [this.user?.email ? this.user.email : '', Validators.compose([
                Validators.required,
                Validators.email,
                Validators.pattern('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+(\.[a-z0-9-]+).(\.[a-z]{2,4})$')
            ])],
            userName: ['', Validators.compose([
                Validators.required,
                Validators.pattern('^([A-Z]|[a-z])[A-Za-z0-9.]*$')
            ])],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(20),
                Validators.pattern('^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,}$')
            ])],
            confirmPassword: [''],
            idSocial: [this.socialUser?.id ? this.socialUser.id : ''],
            profileImage: [this.user?.profile?.profileImage ? this.user.profile.profileImage : '']

        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.controls.password.value;
        const confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
    }

    cadastrar() {
        const username = this.cadastroControl.get('userName').value;
        this.cadastroControl.get('userName').setValue(username.toLowerCase());
        Util.loadingScreen();
        this.cadastroService.cadastrar(this.cadastroControl.value).pipe(take(1)).subscribe((res: UserTO) => {
            const userLogin = {
                email: res.email,
                token: res.token
            };
            Util.stopLoading();
            Util.loadingScreen();

            const login: Login = LoginBuilder.builder()
                .setEmail(userLogin.email)
                .setToken(userLogin.token)
                .build();
            this.loginByTokenUseCase.execute(login).subscribe(
                (user) => {
                    Util.stopLoading();
                    this.setCacheUserUseCase.execute(user);
                    this.removeCacheUseCase.execute(StorageItem.REGISTERING_USER, StorageType.LOCAL_STORAGE);
                    this.router.navigateByUrl('continuar-cadastro');
                }, (error) => {
                    console.log('error login', error);
                });
        },
            (err) => {
                Util.stopLoading();
                let codMessage = '';
                // email
                if (err.error.message.includes('US002')) {
                    codMessage = 'US002';
                }
                // username
                if (err.error.message.includes('US005')) {
                    codMessage = 'US005';
                }
                if (codMessage) {
                    this.translate.get('MESSAGE_ERROR.' + codMessage).subscribe(message => {
                        Util.showErrorDialog(message);
                    });
                } else {
                    this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                        Util.showErrorDialog(message);
                    });
                    console.log(err);
                }
            }
        );
    }
}
