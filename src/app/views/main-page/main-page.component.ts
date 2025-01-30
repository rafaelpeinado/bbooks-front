import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { UserTO } from '../../models/userTO.model';
import { SearchMergedBookUseCase } from 'src/app/core/use-cases/book/search-merged-books.use-case';
import { FilterSearch } from 'src/app/core/domain/interfaces/filter-search.interface';
import { Book } from 'src/app/core/domain/entities/book.entity';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
    public user;
    searchControl;
    books: Book[];
    mediaSub: Subscription;
    deviceXs: boolean;
    totalBooks = 0;
    pageEvent: PageEvent = new PageEvent();
    pageSize = 10;
    logado: UserTO = this.auth.getUser();

    constructor(
        public auth: AuthService,
        private userService: UserService,
        private fb: FormBuilder,
        private searchMergedBookUseCase: SearchMergedBookUseCase,
        public mediaObserver: MediaObserver,

    ) {
        this.searchControl = this.fb.group({
            book: ['']
        });
        this.pageEvent.pageSize = 10;
        this.pageEvent.pageIndex = 0;

    }

    ngOnInit(): void {
        if (this.auth.getToken() != null) {
            this.userService.updateUserInfo();
            this.user = this.auth.getUser();
        }
        this.mediaSub = this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
            this.deviceXs = result[0].mqAlias === 'xs' ? true : false;
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
        this.mediaSub.unsubscribe();
    }

    resetBooks(): void {
        this.books = [];
        this.totalBooks = 0;
    }
}
