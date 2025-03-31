import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { PerfilPageRoutingModule } from './perfil-page.routing.module';
import { FriendComponent } from './friend/friend.component';
import { MainResolve } from './guards/main.resolve';
import { TranslateModule } from '@ngx-translate/core';
import { PerfilComponent } from './perfil/perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FriendResolve } from './guards/friend.resolve';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    declarations: [
        MainPageComponent,
        FriendComponent,
        PerfilComponent
    ],
    imports: [
        CommonModule,
        PerfilPageRoutingModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        TranslateModule.forChild(),
        RouterModule,
        FlexLayoutModule,

        // Material
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatDividerModule,
        MatExpansionModule,
        MatIconModule,
        MatTabsModule,
        MatFormFieldModule,
        MatSelectModule,
    ],
    providers: [
        MainResolve,
        FriendResolve
    ]
})
export class PerfilPageModule {
}
