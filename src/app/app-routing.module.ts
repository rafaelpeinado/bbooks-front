import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './views/main-page/main-page.component';
import { AuthGuard } from './guards/auth-guard';
import { AuthVerifyLogin } from './guards/auth-verify-login';

const routes: Routes = [
    {
        path: '', component: MainPageComponent,
    },
    {
        path: 'perfil',
        canActivate: [AuthGuard],
        loadChildren: () => import('./presentation/perfil-page/perfil-page.module').then(m => m.PerfilPageModule)
    },
    {
        path: 'login',
        canActivate: [AuthVerifyLogin],
        loadChildren: () => import('./presentation/login/login.module').then(m => m.LoginModule)
    },
    {
        path: 'registrar',
        canActivate: [AuthVerifyLogin],
        loadChildren: () => import('./presentation/register-user/register-user.module').then(m => m.RegisterUserModule)
    },
    {
        path: 'senha',
        loadChildren: () => import('./presentation/password/password.module').then(m => m.PasswordModule)
    },
    {
        path: 'search',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/search/search.module').then(m => m.SearchModule)
    },
    {
        path: 'bookcase',
        canActivate: [AuthGuard],
        loadChildren: () => import('./views/book-page/book.module').then(m => m.BookModule)
    },
    { path: 'nova-senha/:token', redirectTo: 'senha/nova-senha/:token', pathMatch: 'full' },
    {
        path: '**',
        loadChildren: () => import('./presentation/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
