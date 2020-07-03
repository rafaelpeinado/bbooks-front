import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MainPageComponent } from './views/main-page/main-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './modals/login/login.component';
import { AuthGuard } from './guards/auth-guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './guards/interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { CadastroComponent } from './views/cadastro/cadastro.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CadastroSegundaEtapaComponent } from './views/cadastro-segunda-etapa/cadastro-segunda-etapa.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    NavBarComponent,
    LoginComponent,
    CadastroComponent,
    CadastroSegundaEtapaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [AuthGuard, {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true}],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
