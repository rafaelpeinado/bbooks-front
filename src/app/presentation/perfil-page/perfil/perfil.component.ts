import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';
import { Util } from '../../../views/shared/utils/util';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent } from '../../../views/upload/upload.component';
import { TranslateService } from '@ngx-translate/core';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetUserByIdUseCase } from 'src/app/core/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from 'src/app/core/use-cases/user/update-user.use-case';
import { UpdateProfileUseCase } from 'src/app/core/use-cases/profile/update-profile.use-case';
import { UserBuilder } from 'src/app/core/domain/builders/user.builder';
import { GetAllCountriesUseCase } from 'src/app/core/use-cases/location/get-all-countries.use-case';
import { Location } from 'src/app/core/domain/entities/location.entity';
import { GetStatesByCountryIdUseCase } from 'src/app/core/use-cases/location/get-states-by-country-id.use-case';
import { GetCitiesByStateIdUseCase } from 'src/app/core/use-cases/location/get-cities-by-state-id.use-case';
import { UploadFileUseCase } from 'src/app/core/use-cases/cdn/upload-file.use-case';
import { CDN } from 'src/app/core/domain/entities/cdn.entity';
import { CDNFileTpe } from 'src/app/core/domain/enums/cdn-file-type.enum';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

    modeBasicInfo: boolean;
    basicInfo: FormGroup;
    public user: User;
    public countries: Location[];
    public cities: Location[];
    public states: Location[];
    public filteredOptionsCity$ = new BehaviorSubject<Location[]>([]);
    image;

    constructor(
        public translate: TranslateService,
        private readonly fb: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly getCachedUserUseCase: GetCachedUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly updateProfileUseCase: UpdateProfileUseCase,
        private readonly getAllCountriesUseCase: GetAllCountriesUseCase,
        private readonly getStatesByCountryIdUseCase: GetStatesByCountryIdUseCase,
        private readonly getCitiesByStateIdUseCase: GetCitiesByStateIdUseCase,
        private readonly uploadFileUseCase: UploadFileUseCase,
    ) {

    }

    ngOnInit(): void {
        this.createForm();
        const user: User = this.getCachedUserUseCase.execute();
        combineLatest([
            this.getUserByIdUseCase.execute(user.id),
            this.getAllCountriesUseCase.execute()
        ]).subscribe(
            (value) => {
                const user: User = value[0];
                this.user = user;
                this.countries = value[1];
                const country: Location = this.countries.find(c => c.name.includes(this.basicInfo.get('country').value));
                this.getStates(country.id);
                this.createForm();
            }, (error) => {
                console.log('error', error);
            });
    }

    createForm() {
        this.basicInfo = this.fb.group({
            name: [this.user?.name ? this.user.name : '', Validators.required],
            lastName: [this.user?.lastName ? this.user.lastName : '', Validators.required],
            email: [this.user?.email ? this.user.email : '', Validators.compose([
                Validators.required,
                Validators.email
            ])],
            userName: [this.user?.profile?.username ? this.user.profile?.username : '', Validators.compose([
                Validators.required,
                Validators.pattern('^([A-Z]|[a-z])[A-Za-z0-9.]*$')
            ])],
            birthDate: [this.user?.profile.birthDate ? this.user.profile.birthDate : ''],
            country: [this.user?.profile.country ? this.user.profile.country : ''],
            state: [this.user?.profile.state ? this.user.profile.state : ''],
            city: [this.user?.profile.city ? this.user.profile.city : ''],
        });
    }

    getStates(countryId: string) {
        this.getStatesByCountryIdUseCase.execute(countryId).pipe(
            finalize(() => Util.stopLoading())
        )
            .subscribe(
                res => this.states = res,
                error => console.log('error states', error)
            );
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
        this.basicInfo.get('city').valueChanges.pipe(
            startWith(''),
            map(value => this._filterCity(value))
        ).subscribe(filteredCities => this.filteredOptionsCity$.next(filteredCities));
    }

    private _filterCity(value: string): Location[] {
        const filterValue = value?.toLowerCase() || '';
        return this.cities.filter(city => city.name.toLowerCase().includes(filterValue));
    }

    verificaValidToTouched(campo: string) {
        return this.basicInfo.get(campo).invalid || this.basicInfo.get(campo).touched;
    }

    changeModeBasicInfo() {
        this.modeBasicInfo = !this.modeBasicInfo;
        return this.modeBasicInfo;
    }

    save() {
        this.user.name = this.basicInfo.get('name').value;
        this.user.lastName = this.basicInfo.get('lastName').value;
        this.user.email = this.basicInfo.get('email').value;
        this.user.profile.username = this.basicInfo.get('userName').value;
        this.user.profile.birthDate = this.basicInfo.get('birthDate').value;
        this.user.profile.country = this.basicInfo.get('country').value;
        this.user.profile.state = this.basicInfo.get('state').value;
        this.user.profile.city = this.basicInfo.get('city').value;
        combineLatest([
            this.updateUserUseCase.execute(this.user),
            this.updateProfileUseCase.execute(this.user),
        ]).subscribe(
            (value) => {
                this.user = UserBuilder.builder()
                    .copyFrom(value[0])
                    .setName(value[1].name)
                    .setLastName(value[1].lastName)
                    .setProfile(value[1].profile)
                    .build();
                this.changeModeBasicInfo();
            },
            (error) => {
                console.log('error update', error);
            }
        );
    }

    showDialogUpload(): void {
        const dialogRef = this.matDialog.open(UploadComponent, {
            height: '350px',
            width: '400px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                Util.loadingScreen();
                const cdn: CDN = {
                    file: result,
                    type: CDNFileTpe.IMAGE,
                    info: { objectType: 'profile_image' },
                };
                this.uploadFileUseCase.execute(cdn)
                    .pipe(finalize(() => Util.stopLoading()))
                    .subscribe(() => {
                        this.image = result;
                        const reader = new FileReader();
                        reader.onload = (e) => this.image = e.target.result;
                        reader.readAsDataURL(this.image);
                        this.user.profile.profileImage = this.image;
                    }, error => {
                        this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(msg => {
                            Util.showErrorDialog(msg);
                        });
                        console.log('error upload', error);
                    });
            }
        });

    }
}
