import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookRoutingModule } from './book.routing.module';
import { BookMenuComponent } from './book-menu/book-menu.component';
import { BookFormComponent } from './book-form/book-form.component';
import { BookEstanteComponent } from './book-estante/book-estante.component';
import { BookPageComponent } from './book-page.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CarrouselComponent } from './carrousel/carrousel.component';
import { BookViewComponent } from './book-view/book-view.component';
import { RatingComponent } from '../../components/rating/rating.component';
import { BookEstanteResolve } from './guards/book-estante.resolve';
import { BookViewResolve } from './guards/book-view.resolve';
import { CarrouselResolve } from './guards/carrousel.resolve';
import { BooksComponent } from './books/books.component';
import { BooksResolve } from './guards/books.resolve';
import { TranslateModule } from '@ngx-translate/core';
import { TagDialogComponent } from './tag-dialog/tag-dialog.component';
import { SharedModule } from 'src/app/views/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BookRoutingModule,
        FlexModule,
        FlexLayoutModule,
        CarouselModule,
        TranslateModule.forChild(),
        SharedModule,

        // Material
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatChipsModule,
        MatMenuModule,
        MatListModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSidenavModule,
    ],
    declarations: [
        BookPageComponent,
        BookFormComponent,
        BookMenuComponent,
        BookEstanteComponent,
        CarrouselComponent,
        BookViewComponent,
        RatingComponent,
        BooksComponent,
        TagDialogComponent,
    ],
    entryComponents: [
        // BookcaseModalComponent
    ],
    providers: [
        BookEstanteResolve,
        CarrouselResolve,
        BookViewResolve,
        BooksResolve
    ],
    bootstrap: [BookPageComponent],
})
export class BookModule {
}
