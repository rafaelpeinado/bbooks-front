import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MainPageComponent } from './views/main-page/main-page.component';
import { NavBarComponent } from './views/nav-bar/nav-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './guards/interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { AuthVerifyLogin } from './guards/auth-verify-login';
import { UploadComponent } from './views/upload/upload.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './views/shared/shared.module';
import { BnNgIdleService } from 'bn-ng-idle';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { BookRepository } from './core/repositories/book.repository';
import { BookServiceFactory } from './infrastructure/adapters/factories/book-service.factory';
import { CacheRepository } from './core/repositories/cache.repository';
import { StorageServiceFactory } from './infrastructure/adapters/factories/storage-service.factory';
import { UserRepository } from './core/repositories/user.repository';
import { UserService } from './infrastructure/adapters/user.service';
import { CacheService } from './infrastructure/adapters/cache.service';
import { AuthRepository } from './core/repositories/auth.repository';
import { LoginServiceFactory } from './infrastructure/adapters/factories/login-service.factory';
import { TagRepository } from './core/repositories/tag.repository';
import { TagApiService } from './infrastructure/adapters/tag.service';
import { UserBookRepository } from './core/repositories/user-book.repository';
import { UserBookApiService } from './infrastructure/adapters/user-book.service';
import { ProfileRepository } from './core/repositories/profile.repository';
import { ProfileApiService } from './infrastructure/adapters/profile.service';
import { FriendshipRepository } from './core/repositories/friendship.repository';
import { FriendshipApiService } from './infrastructure/adapters/friendship.service';
import { AuthorRepository } from './core/repositories/author.repository';
import { AuthorApiService } from './infrastructure/adapters/author.service';
import { LocationRepository } from './core/repositories/location.repository';
import { GeonameApiService } from './infrastructure/adapters/geoname.service';
import { CDNRepository } from './core/repositories/cdn.repository';
import { CDNApiService } from './infrastructure/adapters/cdn.service';
import { AuthGuard } from './guards/auth-guard';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        MainPageComponent,
        NavBarComponent,
        UploadComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        BrowserAnimationsModule,
        SocialLoginModule,
        SharedModule,
        MglTimelineModule,
        StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
        }),
        FontAwesomeModule,
        NgxQRCodeModule,

        // Material
        MatSliderModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatDialogModule,
        MatToolbarModule,
        MatMenuModule,
        MatButtonModule,
        MatBadgeModule,
    ],
    providers: [
        BnNgIdleService,
        AuthVerifyLogin,
        AuthGuard,
        { provide: BookRepository, useClass: BookServiceFactory },
        { provide: CacheRepository, useClass: StorageServiceFactory },
        { provide: AuthRepository, useClass: LoginServiceFactory },
        { provide: UserRepository, useClass: UserService },
        { provide: CacheRepository, useClass: CacheService },
        { provide: TagRepository, useClass: TagApiService },
        { provide: UserBookRepository, useClass: UserBookApiService },
        { provide: ProfileRepository, useClass: ProfileApiService },
        { provide: FriendshipRepository, useClass: FriendshipApiService },
        { provide: AuthorRepository, useClass: AuthorApiService },
        { provide: LocationRepository, useClass: GeonameApiService },
        { provide: CDNRepository, useClass: CDNApiService },
        { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
        {
            provide: ErrorStateMatcher,
            useClass: ShowOnDirtyErrorStateMatcher,
        },
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            environment.gauth
                        ),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(
                            environment.fbauth
                        )
                    }
                ],
            } as SocialAuthServiceConfig
        },
    ],
    exports: [],

    bootstrap: [AppComponent]
})
export class AppModule {
}
