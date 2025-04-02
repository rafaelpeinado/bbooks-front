import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BookCardComponent } from './book-card/book-card.component';
import { BookAddDialogComponent } from './book-add-dialog/book-add-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NumbersOnlyInputDirective } from './directive/numbers-only-input.directive';
import { LoaderComponent } from '../loader/loader.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TextareaAutoresizeDirective } from './directive/textarea-autoresize.directive';
import { SearchBookComponent } from './search-book/search-book.component';
import { BarCodeScannerComponent } from './bar-code-scanner/bar-code-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { EmptyContentMessageComponent } from './empty-content-message/empty-content-message.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    declarations: [
        BookCardComponent,
        BookAddDialogComponent,
        NumbersOnlyInputDirective,
        LoaderComponent,
        TextareaAutoresizeDirective,
        SearchBookComponent,
        BarCodeScannerComponent,
        EmptyContentMessageComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FlexModule,
        FlexLayoutModule,
        HttpClientModule,
        SweetAlert2Module,
        TranslateModule.forChild(),
        ZXingScannerModule,

        // Material
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatPaginatorModule,
        MatCardModule,
        MatDialogModule,
        MatOptionModule,
        MatDatepickerModule,
        MatSelectModule,
        MatCheckboxModule,
        MatNativeDateModule,
    ],
    exports: [
        BookCardComponent,
        NumbersOnlyInputDirective,
        LoaderComponent,
        BookAddDialogComponent,
        TextareaAutoresizeDirective,
        SearchBookComponent,
        BarCodeScannerComponent,
        EmptyContentMessageComponent,
    ],
    providers: []
})
export class SharedModule {
}
