import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaCepService } from '../../services/consulta-cep.service';
import { Observable } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';
import { Country } from '../../models/country.model';
import { State } from '../../models/state.model';
import { City } from '../../models/city.model';
import { CDNService } from 'src/app/services/cdn.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent } from '../upload/upload.component';
import { DateAdapter } from '@angular/material/core';
import { Util } from '../shared/utils/util';
import { TranslateService } from '@ngx-translate/core';
import { ClearCacheUseCase } from 'src/app/core/use-cases/auth/clear-cache.use-case';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { Login } from 'src/app/core/domain/entities/login.entity';
import { LoginBuilder } from 'src/app/core/domain/builders/login.builder';
import { LoginByTokenUseCase } from 'src/app/core/use-cases/auth/login-by-token.use-case';
import { TemporaryService } from 'src/app/services/temporary.service';
import { UpdateProfileUseCase } from 'src/app/core/use-cases/profile/update-profile.use-case';
import { ProfileTO } from 'src/app/infrastructure/dtos/user.dto';
import { GetProfileByIdUseCase } from 'src/app/core/use-cases/profile/get-profile-by-id.use-case';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';

@Component({
    selector: 'app-cadastro-segunda-etapa',
    templateUrl: './cadastro-segunda-etapa.component.html',
    styleUrls: ['./cadastro-segunda-etapa.component.scss']
})
export class CadastroSegundaEtapaComponent implements OnInit {
    public formCadastro2: FormGroup;
    public citys: City[];
    public countrys: Country[];
    public states: State[];
    public profileTO: ProfileTO;
    dataAtual = new Date();
    public user: User;

    maxSize = 3579139;
    file;

    filteredOptionsCity: Observable<City[]>;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private consultaCepService: ConsultaCepService,
        private cdnService: CDNService,
        public dialog: MatDialog,
        private adapter: DateAdapter<any>,
        private translate: TranslateService,
        private clearCacheUseCase: ClearCacheUseCase,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private loginByTokenUseCase: LoginByTokenUseCase,
        private temporaryService: TemporaryService,
        private updateProfileUseCase: UpdateProfileUseCase,
        private getProfileByIdUseCase: GetProfileByIdUseCase,
    ) {
        const browserLang = this.translate.getBrowserLang().toString();
        this.adapter.setLocale(browserLang);
        this.temporaryService.language.subscribe(lang => {
            this.adapter.setLocale(lang);
        });
    }

    ngOnInit(): void {
        this.user = this.getCachedUserUseCase.execute();
        this.createForm();
        this.consultaCepService.getCountry().subscribe(result => {
            this.countrys = result;
        });
    }

    private createForm(): void {
        this.formCadastro2 = this.formBuilder.group({
            id: [],
            image: new FormControl({ value: null, disabled: true }),
            birthDate: new FormControl('', Validators.required),
            country: new FormControl(''),
            city: new FormControl(''),
            state: new FormControl('')
        });
    }

    getStates(country: Country) {
        Util.loadingScreen();
        if (country.id.toString().includes('3469034')) {
            this.consultaCepService.getStatesBr().subscribe(
                res => {
                    this.states = res;
                    Util.stopLoading();
                },
                error => {
                    console.log('error states', error);
                    Util.stopLoading();
                }
            );
        } else {
            this.consultaCepService.getStates(country.id).subscribe(
                res => {
                    this.states = res;
                    Util.stopLoading();
                },
                error => {
                    console.log('error states', error);
                    Util.stopLoading();
                }
            );
        }
    }


    getCitys(state: State) {
        Util.loadingScreen();
        if (state.sigla) {
            this.consultaCepService.getCitysBr(state.id).subscribe(
                res => {
                    Util.stopLoading();
                    this.citys = res;
                    this.filteredOptionsCity = this.formCadastro2.get('city').valueChanges.pipe(
                        startWith(''),
                        map(value => this._filterCity(value))
                    );
                },
                error => {
                    console.log('error get citys', error);
                    Util.stopLoading();
                }
            );

        } else {
            this.consultaCepService.getCitys(state.id).subscribe(
                res => {
                    Util.stopLoading();
                    this.citys = res;
                    this.filteredOptionsCity = this.formCadastro2.get('city').valueChanges.pipe(
                        startWith(''),
                        map(value => this._filterCity(value))
                    );
                },
                error => {
                    console.log('error get citys', error);
                    Util.stopLoading();
                }
            );
        }

    }

    private _filterCity(value: string): City[] {
        const filterValue = value.toLowerCase();
        return this.citys.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    updateProfileTo() {
        this.profileTO.birthDate = this.formCadastro2.get('birthDate').value;
        this.profileTO.country = this.formCadastro2.get('country').value;
        this.profileTO.city = this.formCadastro2.get('city').value;
        this.profileTO.state = this.formCadastro2.get('state').value;
    }

    loginRegister() {
        this.formCadastro2.get('id').setValue(this.user.profile.id);
        if (this.user.profile.profileImage) {
            this.getByIdToUpdateProfile();
        } else {
            if (this.file) {
                Util.loadingScreen();
                this.cdnService.upload({
                    file: this.file,
                    type: 'image'
                }, { objectType: 'profile_image' }).subscribe(() => {
                    this.getByIdToUpdateProfile();
                },
                    error => {
                        Util.stopLoading();
                        console.log('error upload', error);
                        this.clearCacheUseCase.execute();
                    });
            } else {
                this.getByIdToUpdateProfile();
            }
        }

    }

    getByIdToUpdateProfile(): void {
        Util.loadingScreen();
        this.getProfileByIdUseCase.execute(this.user.profile.id)
            .pipe(finalize(() => Util.stopLoading()))
            .subscribe((user) => {
                this.profileTO = ProfileMapper.toDTO(user);
                this.updateProfileTo();
                this.updateProfileToLogin();
            });
    }

    updateProfileToLogin(): void {
        Util.loadingScreen();
        this.updateProfileUseCase.execute(ProfileMapper.toUser(this.profileTO))
            .pipe(finalize(() => Util.stopLoading()))
            .subscribe(
                () => this.login(),
                (error) => {
                    console.log('error update profile', error);
                    this.clearCacheUseCase.execute();
                },
            );
    }

    login(): void {
        Util.loadingScreen();
        const login: Login = LoginBuilder.builder()
            .setEmail(this.user.email)
            .setToken(this.user.token)
            .build();
        this.loginByTokenUseCase.execute(login)
            .pipe(finalize(() => Util.stopLoading()))
            .subscribe(
                () => this.router.navigate(['/feed']),
                (err) => {
                    Util.showErrorDialog(err.error.message);
                    this.clearCacheUseCase.execute();
                }
            );
    }

    consultaCep() {
        const cep = this.formCadastro2.get('cep').value;
        if (cep != null && cep !== '') {
            this.consultaCepService.findByCep(cep).subscribe(
                response => {
                    this.setData(response);
                }
            );
        }
    }

    setData(dados) {
        this.formCadastro2.patchValue({
            cep: dados.cep,
            city: dados.localidade,
            state: dados.uf
        });
    }

    verificaValidToTouched(campo: string) {
        return this.formCadastro2.get(campo).invalid || this.formCadastro2.get(campo).touched;
    }

    chooseFile(file) {
        if (file.size > this.maxSize) {
            alert('O arquivo é muito grande, favor formatar...');
        } else {
            this.file = file;
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
    }

    openDialogUpload() {
        const dialogRef = this.dialog.open(UploadComponent, {
            height: '350px',
            width: '400px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.file = result;
                this.formCadastro2.get('image').setValue(result.name);
            } else {
                this.file = null;
            }
        });
    }
}
