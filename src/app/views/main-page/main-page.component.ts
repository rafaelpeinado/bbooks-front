import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SearchMergedBookUseCase } from 'src/app/core/use-cases/book/search-merged-books.use-case';
import { FilterSearch } from 'src/app/core/domain/interfaces/filter-search.interface';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetIsLoggedUseCase } from 'src/app/core/use-cases/auth/get-is-logged.use-case';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
    public user: User;
    public isCompleted = false;
    public isLogged = false;
    private isLoggedSubscription: Subscription;
    searchControl;
    books: Book[];
    deviceXs: boolean;
    totalBooks = 0;
    pageEvent: PageEvent = new PageEvent();
    pageSize = 10;
    private mediaSub: Subscription;

    constructor(
        private fb: FormBuilder,
        private searchMergedBookUseCase: SearchMergedBookUseCase,
        private mediaObserver: MediaObserver,
        private getIsLoggedUseCase: GetIsLoggedUseCase,

    ) {
        this.searchControl = this.fb.group({
            book: ['']
        });
        this.pageEvent.pageSize = 10;
        this.pageEvent.pageIndex = 0;

    }

    ngOnInit(): void {
        this.isLoggedSubscription = this.getIsLoggedUseCase.execute()
            .subscribe((isLogged) => {
                this.isLogged = isLogged;
                this.isCompleted = true;
            });

        this.mediaSub = this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
            this.deviceXs = result[0].mqAlias === 'xs';
        });
    }

    searchBook(): void {
        const filter: FilterSearch = {
            input: this.searchControl.value.book.split(' ').join('+'),
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
            }, error => console.log(error));
    }

    changePage(event: PageEvent) {
        this.pageEvent = event;
        this.searchBook();
    }

    ngOnDestroy(): void {
        this.mediaSub?.unsubscribe();
        this.isLoggedSubscription?.unsubscribe();
    }

    resetBooks(): void {
        this.books = [];
        this.totalBooks = 0;
    }
}
