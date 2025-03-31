import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { FriendComponent } from './friend/friend.component';
import { MainResolve } from './guards/main.resolve';
import { MainGuard } from './guards/main.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from '../../guards/auth-guard';
import { FriendResolve } from './guards/friend.resolve';


const perfilRouter = [
    {
        path: ':username', component: MainPageComponent,
        canActivate: [MainGuard],
        resolve: { user: MainResolve },
        children: [
            {
                path: 'friends', component: FriendComponent,
                resolve: { user: FriendResolve }
            },
            { path: '', redirectTo: 'friends', pathMatch: 'full' },
        ]

    },
    {
        path: ':username/settings', component: PerfilComponent,
        canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(perfilRouter)],
    exports: [RouterModule]
})
export class PerfilPageRoutingModule { }
