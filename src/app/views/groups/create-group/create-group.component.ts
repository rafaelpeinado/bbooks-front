import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { mapPostPrivacy, PostPrivacy } from '../../../models/enums/PostPrivacy.enum';
import { GroupService } from '../../../services/group.service';
import { Util } from '../../shared/Utils/util';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-create-group',
    templateUrl: './create-group.component.html',
    styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

    public formGroup: FormGroup;
    public privacy = PostPrivacy;
    public mapPostPrivacy = mapPostPrivacy;
    buttonActiveForm = false;

    constructor(
        private formBuilder: FormBuilder,
        private groupService: GroupService,
        private translate: TranslateService,
        private router: Router,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.createForm();
    }

    private createForm(): void {
        const user: User = this.getCachedUserUseCase.execute();
        this.formGroup = this.formBuilder.group({
            name: new FormControl(null, Validators.required),
            description: new FormControl(null),
            privacy: new FormControl(mapPostPrivacy.get(this.privacy.public_all), Validators.required),
            userId: new FormControl(user.id)
        });
    }

    showCreateForm(): void {
        this.buttonActiveForm = !this.buttonActiveForm;
    }

    save(): void {
        Util.loadingScreen();
        this.groupService.save(this.formGroup.value)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                this.translate.get('GRUPO_LEITURA.GRUPO_CRIADO').subscribe(message => {
                    Util.showSuccessDialog(message);
                    this.router.navigate(['/groups-search/your-groups']);
                });
            },
                error => {
                    Util.stopLoading();
                    let codMessage = '';
                    if (error.error.message.includes('GR002')) {
                        codMessage = 'GR002';
                    }
                    if (codMessage) {
                        this.translate.get('GRUPO_LEITURA.GRUPO_EXISTS').subscribe(message => {
                            Util.showErrorDialog(message);
                        });
                    } else {
                        this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                            Util.showErrorDialog(message);
                        });
                        console.log('Error Grupo save', error);
                    }

                });
    }

}
