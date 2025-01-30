import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../services/auth.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { FilterSearch } from 'src/app/core/domain/interfaces/filter-search.interface';
import { SearchMergedBookUseCase } from 'src/app/core/use-cases/book/search-merged-books.use-case';

@Component({
    selector: 'app-books-search',
    templateUrl: './books-search.component.html',
    styleUrls: ['./books-search.component.scss']
})
export class BooksSearchComponent implements OnInit, OnDestroy {
    public user;
    books: Book[];
    mediaSub: Subscription;
    deviceXs: boolean;
    totalBooks = 0;
    pageEvent: PageEvent = new PageEvent();
    pageSize = 10;
    search;
    loading = false;

    constructor(
        private searchMergedBookUseCase: SearchMergedBookUseCase,
        public mediaObserver: MediaObserver,
        private route: ActivatedRoute,
        private authGuard: AuthService,
    ) {
        this.pageEvent.pageSize = 10;
        this.pageEvent.pageIndex = 0;
    }

    ngOnInit(): void {
        this.user = this.authGuard.getUser();

        this.mediaSub = this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
            this.deviceXs = result[0].mqAlias === 'xs' ? true : false;
        });
        this.route.queryParams
            .pipe(
                map(params => params.search)
            )
            .subscribe(params => {
                this.search = params;
                this.searchBook();
            });
    }

    searchBook(): void {
        if (this.search) {
            this.loading = true;
            const filter: FilterSearch = {
                input: this.search.split(' ').join('+'),
                page: this.pageEvent.pageIndex,
                size: 10,
            };
            this.searchMergedBookUseCase.execute(filter)
                .subscribe((response) => {
                    this.totalBooks = response.totalElements;
                    const books: Book[] = response.content;
                    if (books.length > 0) {
                        this.books = books;
                    } else {
                        this.resetBooks();
                    }
                },
                    error => console.log(error));
        }
    }

    changePage(event: PageEvent) {
        this.pageEvent = event;
        this.searchBook();
    }

    ngOnDestroy(): void {
        this.mediaSub.unsubscribe();
    }

    resetBooks(): void {
        this.books = [];
        this.totalBooks = 0;
    }

}
