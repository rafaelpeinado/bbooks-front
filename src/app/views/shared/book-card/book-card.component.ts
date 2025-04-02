import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BookAddDialogComponent } from '../book-add-dialog/book-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { GetAllUserBookByProfileIdUseCase } from 'src/app/core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { combineLatest } from 'rxjs';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { ChangeStatusUserBookUseCase } from 'src/app/core/use-cases/user-book/change-status-user-book.use-case';
import { UserBookBuilder } from 'src/app/core/domain/builders/user-book.builder';
import { TemporaryService } from 'src/app/services/temporary.service';
import { BookStatus } from 'src/app/core/domain/enums/book-status.enum';

@Component({
    selector: 'app-book-card',
    templateUrl: './book-card.component.html',
    styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {

    @Output() bookReturn = new EventEmitter<any>();
    @Input() book?: Book;
    @Input() userBook?: UserBook;
    @Input() deviceXs: boolean;
    @Input() idTag: any;
    @Input() logged: boolean;
    @Input() canEdit: boolean;

    public isCompleted = false;
    public routerlink: string;
    public bookStatus = BookStatus;
    private isUserBook: boolean;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private getBookByIdUseCase: GetBookByIdUseCase,
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
        private changeStatusUserBookUseCase: ChangeStatusUserBookUseCase,
        private temporaryService: TemporaryService,
    ) {
    }

    ngOnInit(): void {
        if (!this.userBook) {
            this.isCompleted = true;
        } else {
            this.getBookByIdUseCase.execute(this.userBook.book.id, this.userBook.book.api)
                .subscribe((book) => {
                    this.book = book;
                    this.isCompleted = true;
                });
        }

        this.isUserBook = this.router.url.includes('mybooks');
        const baseRoute = this.isUserBook ? '/bookcase/mybooks/' : '/bookcase/book/';
        this.routerlink = this.idTag ? `${baseRoute}${this.idTag}/` : '/bookcase/books/';
    }


    changeStatusBook(bookStatus: BookStatus, userBookId: string, book: Book) {
        const userBook: UserBook = UserBookBuilder.builder()
            .setId(userBookId)
            .setStatus(bookStatus)
            .build();

        this.changeStatusUserBookUseCase.execute(userBook).subscribe(value => {
            this.userBook.status = value.status;
            this.bookReturn.emit({ status: value.status, book });
        }, error => {
            console.log('Error', error);
        });
    }

    openDialogAddBook(userBook: UserBook) {
        const dialogRef = this.dialog.open(BookAddDialogComponent, {
            height: '450px',
            width: '400px',
            data: { userBook },
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getBook();
            this.temporaryService.updateListCarrousel.emit(true);
        });
    }

    getBook(): void {
        combineLatest([
            this.getAllUserBookByProfileIdUseCase.execute(),
            this.getBookByIdUseCase.execute(this.book.id, this.book.api)
        ]).subscribe((value) => {
            const userBooks: UserBook[] = value[0];
            const book: Book = value[1];
            const isUserBook: UserBook = userBooks.find((isUserBook) => isUserBook.book.id === book.id);

            this.book = book;
            this.isUserBook = isUserBook.id ? true : false;
        });

    }

    verifyrouter(): boolean {
        return this.router.url.includes('my');
    }


}
