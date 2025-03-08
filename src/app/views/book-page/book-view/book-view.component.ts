import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../../../models/book.model';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map, switchMap, take } from 'rxjs/operators';
import {
    BookStatus,
    BookStatusEnglish,
    mapBookStatusEnglish
} from '../../../models/enums/BookStatus.enum';
import { BookAddDialogComponent } from '../../shared/book-add-dialog/book-add-dialog.component';
import { GoogleBooksService } from '../../../services/google-books.service';
import { BookService } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { UserbookService } from '../../../services/userbook.service';
import { UserBooksDataStatusTO } from '../../../models/UserBooksDataStatusTO.model';
import { Util } from '../../shared/Utils/util';

@Component({
    selector: 'app-book-view',
    templateUrl: './book-view.component.html',
    styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit, OnDestroy {

    inscricao: Subscription;
    book: Book = new Book();
    userBooksDataStatusTO: UserBooksDataStatusTO;
    stars: number[] = [1, 2, 3, 4, 5];
    rating = 1;
    stringAuthors: string[];

    status = BookStatus;
    mapEnglish = mapBookStatusEnglish;
    statusEnglish = BookStatusEnglish;
    panelOpenState = true;
    percentage: number;

    pageEvent: PageEvent = new PageEvent();

    hasReadingTarget: boolean;

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private gBookService: GoogleBooksService,
        private bookService: BookService,
        public authService: AuthService,
        private profileService: ProfileService,
        private translate: TranslateService,
        private userBookService: UserbookService
    ) {
        Util.loadingScreen();
        this.inscricao = this.route.data.subscribe((data: { book: Book }) => {
            Util.stopLoading();
            this.book = data.book;
            this.stringAuthors = this.convertAuthorsToString();
        });
        this.pageEvent.pageSize = 10;
        this.pageEvent.pageIndex = 0;
    }

    ngOnInit(): void {
        this.getBook();
    }

    getDataStatusByGoogleBook(): void {
        Util.loadingScreen();
        this.userBookService.getDataStatusByBooksGoogleBook(this.book.id)
            .pipe(take(1))
            .subscribe(result => {
                Util.stopLoading();
                this.userBooksDataStatusTO = result;
            },
                error => {
                    console.log('Error: getDataStatusByBooksGoogleBook', error);
                });
    }

    getDataStatusByBookId(): void {
        Util.loadingScreen();
        this.userBookService.getDataStatusByBooksBookId(this.book.id)
            .pipe(take(1))
            .subscribe(result => {
                Util.stopLoading();
                this.userBooksDataStatusTO = result;
            },
                error => {
                    console.log('Error: getDataStatusByBooksGoogleBook', error);
                });
    }

    getBook(userbookResult?): void {
        Util.loadingScreen();
        if (this.book.api === 'google') {
            this.gBookService.getById(this.book.id).subscribe(b => {
                Util.stopLoading();
                const book = this.bookService.convertBookToModel(b);
                if (userbookResult) {
                    book.status = userbookResult.status;
                    book.idUserBook = userbookResult.id;
                    book.finishDate = userbookResult.finishDate;
                    this.book = book;
                    this.getDataStatusByGoogleBook();
                } else {
                    this.bookService.getAllUserBooks().subscribe((userbooks) => {
                        userbooks.books.forEach(userbook => {
                            if (userbook.idBookGoogle === book.id) {
                                book.status = userbook.status;
                                book.idUserBook = userbook.id;
                                book.finishDate = userbook.finishDate;
                            }
                        });
                        Util.stopLoading();
                        this.book = book;
                        this.getDataStatusByGoogleBook();
                    });
                }
            });
        } else {
            // tslint:disable-next-line:radix
            this.bookService.getById(Number.parseInt(this.book.id)).subscribe(b => {

                if (userbookResult) {
                    b.status = userbookResult.status;
                    b.idUserBook = userbookResult.id;
                    b.finishDate = userbookResult.finishDate;
                    this.book = b;
                    this.getDataStatusByGoogleBook();
                } else {
                    this.bookService.getAllUserBooks().subscribe((userbooks) => {
                        userbooks.books.forEach(userbook => {
                            if (userbook.idBook === b.id) {
                                b.status = userbook.status;
                                b.idUserBook = userbook.id;
                                b.finishDate = userbook.finishDate;
                            }
                        });
                        this.book = b;
                        this.getDataStatusByBookId();
                    });
                }
            });
        }
    }


    verifystatusBook(): boolean {
        return this.book.status === this.status.EMPRESTADO || !this.book.idUserBook;
    }

    ngOnDestroy(): void {
        this.inscricao.unsubscribe();
    }

    verifyPercentageIsLess100() {
        return this.percentage <= 100;
    }

    convertAuthorsToString(): string[] {
        const namesAuthors = this.book.authors.map(value => value.name);
        return namesAuthors;
    }

    openDialogAddBook(book: Book) {
        const dialogRef = this.dialog.open(BookAddDialogComponent, {
            height: '450px',
            width: '400px',
            data: {
                book
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getBook(result);
        });
    }

    public calculateDays(): string {
        const currentDate = new Date();
        const lastDayOfYear = new Date('12/31/' + currentDate.getFullYear());
        const diffenceOfDates = Math.abs(lastDayOfYear.getTime() - currentDate.getTime());
        const differenceInDays = Math.ceil(diffenceOfDates / (1000 * 3600 * 24));
        return differenceInDays.toString();
    }
}
