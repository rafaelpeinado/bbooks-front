import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { UserBookDetails } from 'src/app/core/domain/interfaces/user-book-details.interface';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { GetGeneralStatusBooksUseCase } from 'src/app/core/use-cases/user-book/get-general-status-books.use-case';
import { GeneralStatus } from 'src/app/core/domain/entities/general-status.entity';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { BookStatus, BookStatusEnglish, mapBookStatusEnglish } from 'src/app/core/domain/enums/book-status.enum';
import { Util } from 'src/app/views/shared/utils/util';
import { BookAddDialogComponent } from 'src/app/views/shared/book-add-dialog/book-add-dialog.component';
import { UserBookBuilder } from 'src/app/core/domain/builders/user-book.builder';

@Component({
    selector: 'app-book-view',
    templateUrl: './book-view.component.html',
    styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit, OnDestroy {

    public user: User;
    inscricao: Subscription;
    book: Book;
    userBook: UserBook;
    generalStatus: GeneralStatus;
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
        private readonly route: ActivatedRoute,
        private readonly dialog: MatDialog,
        private readonly getBookByIdUseCase: GetBookByIdUseCase,
        private readonly getGeneralStatusBooksUseCase: GetGeneralStatusBooksUseCase,
        private readonly getCachedUserUseCase: GetCachedUserUseCase,
    ) {
        Util.loadingScreen();
        this.inscricao = this.route.data.subscribe((data: { userBookDetails: UserBookDetails }) => {
            Util.stopLoading();
            this.userBook = UserBookBuilder.builder().copyFrom(data.userBookDetails.userBook).setBook(data.userBookDetails.book).build();
            this.book = data.userBookDetails.book;
            this.stringAuthors = this.convertAuthorsToString();
        });
        this.pageEvent.pageSize = 10;
        this.pageEvent.pageIndex = 0;
    }

    ngOnInit(): void {
        this.user = this.getCachedUserUseCase.execute();
        this.getBook();
    }

    ngOnDestroy(): void {
        this.inscricao.unsubscribe();
    }

    getBook(userbookResult?): void {
        Util.loadingScreen();
        combineLatest([
            this.getBookByIdUseCase.execute(this.book.id, this.book.api),
            this.getGeneralStatusBooksUseCase.execute(this.book.id, this.book.api)
        ]).subscribe((value) => {
            Util.stopLoading();
            this.generalStatus = value[1];
            this.book = value[0];
        });
    }

    verifystatusBook(): boolean {
        return this.userBook.status === this.status.EMPRESTADO || !this.userBook.id;
    }

    verifyPercentageIsLess100() {
        return this.percentage <= 100;
    }

    convertAuthorsToString(): string[] {
        const namesAuthors = this.book.authors?.map(value => value.name);
        return namesAuthors;
    }

    openDialogAddBook(userBook: UserBook, book: Book) {
        const dialogRef = this.dialog.open(BookAddDialogComponent, {
            height: '450px',
            width: '400px',
            data: {
                userBook,
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
