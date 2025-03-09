import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BookCardComponent } from './book-card/book-card.component';
import { BookAddDialogComponent } from './book-add-dialog/book-add-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NumbersOnlyInputDirective } from './directive/numbers-only-input.directive';
import { LoaderComponent } from '../../loader/loader.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TextareaAutoresizeDirective } from './directive/textarea-autoresize.directive';
import { SearchBookComponent } from './search-book/search-book.component';
import { BarCodeScannerComponent } from './bar-code-scanner/bar-code-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
    declarations: [
        BookCardComponent,
        BookAddDialogComponent,
        NumbersOnlyInputDirective,
        LoaderComponent,
        TextareaAutoresizeDirective,
        SearchBookComponent,
        BarCodeScannerComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FlexModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FlexLayoutModule,
        HttpClientModule,
        SweetAlert2Module,
        TranslateModule.forChild(),
        ZXingScannerModule,
    ],
    exports: [
        BookCardComponent,
        NumbersOnlyInputDirective,
        LoaderComponent,
        BookAddDialogComponent,
        TextareaAutoresizeDirective,
        SearchBookComponent,
        BarCodeScannerComponent,
    ],
    providers: []
})
export class SharedModule {
}
