import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search.routing.module';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { MainSearchComponent } from './main-search/main-search.component';
import { PesquisarAmigosComponent } from './pesquisar-amigos/pesquisar-amigos.component';
import { BooksSearchComponent } from './books-search/books-search.component';
import { SharedModule } from 'src/app/views/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


@NgModule({
    declarations: [
        MainSearchComponent,
        PesquisarAmigosComponent,
        BooksSearchComponent,
    ],
    imports: [
        CommonModule,
        SearchRoutingModule,
        FlexModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        RouterModule,
        TranslateModule.forChild(),
        SharedModule,

        // Material
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
        MatPaginatorModule,
        MatDividerModule,
        MatTabsModule,
        MatSelectModule,
        MatInputModule,
    ]
})
export class SearchModule {
}
