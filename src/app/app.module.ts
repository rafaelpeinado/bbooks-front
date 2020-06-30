import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MainPageComponent } from './views/main-page/main-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './modals/login/login.component';
import { AuthGuard } from './guards/auth-guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './guards/interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookComponent } from './modals/book/book.component';
import { AuthConfirmComponent } from './views/auth-confirm/auth-confirm.component';
import { CadastroComponent } from './views/cadastro/cadastro.component';
import { CadastroSegundaEtapaComponent } from './views/cadastro-segunda-etapa/cadastro-segunda-etapa.component';
import { BookPageComponent } from './views/book-page/book-page.component';
import { BookFormComponent } from './views/book-page/book-form/book-form.component';
import { BookViewComponent } from './views/book-page/book-view/book-view.component';
import { BookMenuComponent } from './views/book-page/book-menu/book-menu.component';
import {BookService} from './shared/book.service';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    NavBarComponent,
    LoginComponent,
    BookComponent,
    AuthConfirmComponent,
    CadastroComponent,
    CadastroSegundaEtapaComponent,
    BookPageComponent,
    BookFormComponent,
    BookViewComponent,
    BookMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgbModule
  ],
  entryComponents: [
      BookViewComponent
  ],
  providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }, BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
