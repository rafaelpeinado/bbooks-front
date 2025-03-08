import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';
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
import { GetAllCountriesUseCase } from 'src/app/core/use-cases/location/get-all-countries.use-case';
import { Location } from 'src/app/core/domain/entities/location.entity';
import { GetStatesByCountryIdUseCase } from 'src/app/core/use-cases/location/get-states-by-country-id.use-case';
import { GetCitiesByStateIdUseCase } from 'src/app/core/use-cases/location/get-cities-by-state-id.use-case';
import { CDN } from 'src/app/core/domain/entities/cdn.entity';
import { CDNFileTpe } from 'src/app/core/domain/enums/cdn-file-type.enum';
import { UploadFileUseCase } from 'src/app/core/use-cases/cdn/upload-file.use-case';

@Component({
    selector: 'app-cadastro-segunda-etapa',
    templateUrl: './cadastro-segunda-etapa.component.html',
    styleUrls: ['./cadastro-segunda-etapa.component.scss']
})
export class CadastroSegundaEtapaComponent implements OnInit {
    public formCadastro2: FormGroup;
    public cities: Location[];
    public countries: Location[];
    public states: Location[];
    public profileTO: ProfileTO;
    public filteredOptionsCity$ = new BehaviorSubject<Location[]>([]);
    dataAtual = new Date();
    public user: User;

    maxSize = 3579139;
    file;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private adapter: DateAdapter<any>,
        private translate: TranslateService,
        private readonly clearCacheUseCase: ClearCacheUseCase,
        private readonly getCachedUserUseCase: GetCachedUserUseCase,
        private readonly loginByTokenUseCase: LoginByTokenUseCase,
        private readonly temporaryService: TemporaryService,
        private readonly updateProfileUseCase: UpdateProfileUseCase,
        private readonly getProfileByIdUseCase: GetProfileByIdUseCase,
        private readonly getAllCountriesUseCase: GetAllCountriesUseCase,
        private readonly getStatesByCountryIdUseCase: GetStatesByCountryIdUseCase,
        private readonly getCitiesByStateIdUseCase: GetCitiesByStateIdUseCase,
        private readonly uploadFileUseCase: UploadFileUseCase,
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
        this.getAllCountriesUseCase.execute().subscribe(result => {
            this.countries = result;
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

    getStates(countryId: string) {
        Util.loadingScreen();
        this.getStatesByCountryIdUseCase.execute(countryId).pipe(
            finalize(() => Util.stopLoading())
        ).subscribe((states) => this.states = states);
    }



    getCities(stateId: string) {
        Util.loadingScreen();

        this.getCitiesByStateIdUseCase.execute(stateId).pipe(
            finalize(() => Util.stopLoading())
        ).subscribe((cities) => {
            this.cities = cities;
            this.setupCityFilter();
        });
    }

    private setupCityFilter(): void {
        this.formCadastro2.get('city').valueChanges.pipe(
            startWith(''),
            map(value => this._filterCity(value))
        ).subscribe(filteredCities => this.filteredOptionsCity$.next(filteredCities));
    }

    private _filterCity(value: string): Location[] {
        const filterValue = value?.toLowerCase() || '';
        return this.cities.filter(city => city.name.toLowerCase().includes(filterValue));
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
                const cdn: CDN = {
                    file: this.file,
                    type: CDNFileTpe.IMAGE,
                    info: { objectType: 'profile_image' },
                };
                this.uploadFileUseCase.execute(cdn)
                    .pipe(finalize(() => Util.stopLoading()))
                    .subscribe(() => {
                        this.getByIdToUpdateProfile();
                    }, error => {
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
                () => this.router.navigate(['/']),
                (err) => {
                    Util.showErrorDialog(err.error.message);
                    this.clearCacheUseCase.execute();
                }
            );
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
