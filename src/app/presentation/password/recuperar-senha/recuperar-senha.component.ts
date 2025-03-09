import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Util } from '../../../views/shared/utils/util';
import { environment } from '../../../../environments/environment';
import { SendEmailResetPasswordUseCase } from 'src/app/core/use-cases/auth/send-email-reset-password.use-case';

@Component({
    selector: 'app-recuperar-senha',
    templateUrl: './recuperar-senha.component.html',
    styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {
    form: FormGroup;

    showMessage: boolean;

    constructor(
        private fb: FormBuilder,
        private translate: TranslateService,
        private sendEmailResetPasswordUseCase: SendEmailResetPasswordUseCase,
    ) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            url: [environment.webFront + '/senha/nova-senha/'],
            email: ['', Validators.compose([
                Validators.required,
                Validators.email
            ])]
        });
    }

    sendResetPassRequest() {
        Util.loadingScreen();
        const input: { email: string; url: string } = {
            email: this.form.value.email,
            url: this.form.value.url,
        };
        this.sendEmailResetPasswordUseCase.execute(input).pipe(
            finalize(() => Util.stopLoading()),
            switchMap(() => this.translate.get('PADRAO.EMAIL_ENVIADO')),
        ).subscribe(
            (message) => {
                Util.showSuccessDialog(message);
                this.showMessage = true;
                this.form.disable();
            }, (error) => {
                Util.stopLoading();
                let codeMessage = '';
                if (error.error.message.includes('US001')) {
                    codeMessage = 'US001';
                }
                if (codeMessage) {
                    this.translate.get('MESSAGE_ERROR.US001').subscribe(message => {
                        Util.showErrorDialog(message);
                    });
                } else {
                    this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                        Util.showErrorDialog(message);
                    });
                    console.log('Error reset pass', error);
                }
                this.showMessage = false;
            });
    }

}
