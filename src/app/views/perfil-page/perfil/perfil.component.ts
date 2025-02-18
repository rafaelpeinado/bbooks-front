import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/models/country.model';
import { ConsultaCepService } from 'src/app/services/consulta-cep.service';
import { City } from 'src/app/models/city.model';
import { State } from 'src/app/models/state.model';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProfileService } from '../../../services/profile.service';
import { CDNService } from '../../../services/cdn.service';
import { Util } from '../../shared/Utils/util';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent } from '../../upload/upload.component';
import { TranslateService } from '@ngx-translate/core';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetUserByIdUseCase } from 'src/app/core/use-cases/user/get-user-by-id.use-case';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';
import { UpdateUserUseCase } from 'src/app/core/use-cases/user/update-user.use-case';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

    modeBasicInfo: boolean;
    basicInfo: FormGroup;
    public user: User;
    public countries: Country[];
    public cities: City[];
    public states: State[];
    image;
    filteredOptionsCity: Observable<City[]>;

    constructor(
        private fb: FormBuilder,
        private consultaCepService: ConsultaCepService,
        private profileService: ProfileService,
        private cdnService: CDNService,
        private matDialog: MatDialog,
        public translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase,
        private updateUserUseCase: UpdateUserUseCase,
    ) {

    }

    ngOnInit(): void {
        this.createForm();
        const user: User = this.getCachedUserUseCase.execute();
        combineLatest([
            this.getUserByIdUseCase.execute(user.id),
            this.consultaCepService.getCountry()
        ]).subscribe(
            (value) => {
                const user: User = value[0];
                this.user = user;
                this.countries = value[1];
                const country: Country = this.countries.find(c => c.name.includes(this.basicInfo.get('country').value));
                this.getStates(country);
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

    getStates(country: Country) {
        if (country.id.toString().includes('3469034')) {
            this.consultaCepService.getStatesBr().subscribe(
                res => this.states = res,
                error => console.log('error states', error)
            );
        } else {
            this.consultaCepService.getStates(country.id).subscribe(
                res => this.states = res,
                error => console.log('error states', error)
            );
        }
    }

    getCitys(state: State) {
        this.basicInfo.get('city').setValue('');
        if (state.sigla) {
            this.consultaCepService.getCitysBr(state.id).subscribe(
                res => {
                    this.cities = res;
                    this.filteredOptionsCity = this.basicInfo.get('city').valueChanges.pipe(
                        startWith(''),
                        map(value => this._filterCity(value))
                    );
                },
                error => console.log('error get cities', error)
            );

        } else {
            this.consultaCepService.getCitys(state.id).subscribe(
                res => {
                    this.cities = res;
                    this.filteredOptionsCity = this.basicInfo.get('city').valueChanges.pipe(
                        startWith(''),
                        map(value => this._filterCity(value))
                    );
                },
                error => console.log('error get cities', error)
            );
        }

    }

    private _filterCity(value: string): City[] {
        const filterValue = value.toLowerCase();
        return this.cities.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    verificaValidToTouched(campo: string) {
        return this.basicInfo.get(campo).invalid || this.basicInfo.get(campo).touched;
    }

    changeModeBasicInfo() {
        return this.modeBasicInfo = !this.modeBasicInfo;
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
            this.profileService.update(ProfileMapper.toDTO(this.user))
        ]).subscribe(
            (value) => {
                this.user = value[0];
                this.user.profile = value[1];
                this.changeModeBasicInfo();
            },
            (error) => {
                console.log('error update', error);
            }
        )
    }

    showDialogUpload(): void {
        const dialogRef = this.matDialog.open(UploadComponent, {
            height: '350px',
            width: '400px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                Util.loadingScreen();
                this.cdnService.upload({ file: result, type: 'image' }, { objectType: 'profile_image' }).subscribe(() => {
                    Util.stopLoading();
                    this.image = result;
                    const reader = new FileReader();
                    reader.onload = (e) => this.image = e.target.result;
                    reader.readAsDataURL(this.image);
                    this.user.profile.profileImage = this.image;
                },
                    error => {
                        Util.stopLoading();
                        this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(msg => {
                            Util.showErrorDialog(msg);
                        });
                        console.log('error upload', error);
                    });
            }
        });

    }
}
