import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyErrorStateMatcher } from '../cadastro/cadastro.component';
import { TranslateService } from '@ngx-translate/core';
import { Util } from '../shared/Utils/util';
import { GetUserByPasswordTokenUseCase } from 'src/app/core/use-cases/auth/get-user-by-password-token.use-case';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/core/domain/entities/user.entity';
import { ChangePasswordUseCase } from 'src/app/core/use-cases/auth/change-password.use-case';
import { LoginBuilder } from 'src/app/core/domain/builders/login.builder';
import { Login } from 'src/app/core/domain/entities/login.entity';


@Component({
    selector: 'app-nova-senha',
    templateUrl: './nova-senha.component.html',
    styleUrls: ['./nova-senha.component.scss']
})
export class NovaSenhaComponent implements OnInit {

    hide = true;
    matcher = new MyErrorStateMatcher();
    newPassword: FormGroup;
    user: User;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
        private getUserByPasswordTokenUseCase: GetUserByPasswordTokenUseCase,
        private changePasswordUseCase: ChangePasswordUseCase,
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.route.params.pipe(
            switchMap((result) => this.getUserByPasswordTokenUseCase.execute(result?.token))
        ).subscribe((user) => {
            this.user = user;
            this.createForm();
        });
    }

    createForm() {
        this.newPassword = this.fb.group({
            email: [this.user?.email ? this.user.email : '', Validators.compose([
                Validators.required,
                Validators.email
            ])],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(20),
                Validators.pattern('^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,}$')
            ])],
            confirmPassword: [''],
        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.controls.password.value;
        const confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
    }

    resetPassword() {
        const login: Login = LoginBuilder.builder()
            .setToken(this.user.token)
            .setPassword(this.newPassword.get('password').value)
            .build();
        this.changePasswordUseCase.execute(login).pipe(
            switchMap(() => this.translate.get('PADRAO.SENHA_ALTERADA'))).subscribe((message) => {
                Util.showSuccessDialog(message);
                this.router.navigate(['/']);
            }, (error) => {
                console.log('error reset pass', error);
            });

    }
}
