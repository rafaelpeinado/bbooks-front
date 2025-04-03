import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Util } from '../utils/util';
import { MatDialogRef } from '@angular/material/dialog';
import { FilterSearch } from 'src/app/core/domain/interfaces/filter-search.interface';
import { SearchMergedBookUseCase } from 'src/app/core/use-cases/book/search-merged-books.use-case';
import { Book } from 'src/app/core/domain/entities/book.entity';

@Component({
    selector: 'app-search-book',
    templateUrl: './search-book.component.html',
    styleUrls: ['./search-book.component.scss']
})
export class SearchBookComponent {
    formSearch: FormGroup;
    books: Book[] = [];
    totalBooks = 0;
    pageEvent: PageEvent = new PageEvent();
    pageSize = 10;

    constructor(
        private readonly searchMergedBookUseCase: SearchMergedBookUseCase,
        private readonly fb: FormBuilder,
        private readonly dialogRef: MatDialogRef<SearchBookComponent>,
    ) {
        this.formSearch = this.fb.group({
            search: ['']
        });
        this.pageEvent.pageSize = 10;
        this.pageEvent.pageIndex = 0;
    }

    searchBooks(): void {
        const filter: FilterSearch = {
            input: this.formSearch.value.book.split(' ').join('+'),
            page: this.pageEvent.pageIndex,
            size: 10,
        };

        Util.loadingScreen();
        this.searchMergedBookUseCase.execute(filter)
            .subscribe((response) => {
                Util.stopLoading();
                this.totalBooks = response.totalElements;
                this.books = response.content;
            }, error => {
                console.log('error search book', error);
            });
    }

    changePage(event: PageEvent) {
        this.pageEvent = event;
        this.searchBooks();
    }

    getBook(book: Book): void {
        this.dialogRef.close(book);
    }

    onKeyDown($event) {
        console.log($event);
    }
}
