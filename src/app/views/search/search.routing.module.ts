import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainSearchComponent } from './main-search/main-search.component';
import { PesquisarAmigosComponent } from './pesquisar-amigos/pesquisar-amigos.component';
import { BooksSearchComponent } from './books-search/books-search.component';

const searchRouter = [
    {
        path: '',
        component: MainSearchComponent,
        children: [
            {
                path: 'people',
                component: PesquisarAmigosComponent
            },
            {
                path: 'books',
                component: BooksSearchComponent
            },
            { path: '', redirectTo: 'people', pathMatch: 'full' },

        ]
    },


];

@NgModule({
    imports: [RouterModule.forChild(searchRouter)],
    exports: [RouterModule]
})
export class SearchRoutingModule { }
