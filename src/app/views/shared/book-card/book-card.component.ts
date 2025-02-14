import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookStatus, mapBookStatus } from '../../../models/enums/BookStatus.enum';
import { Router } from '@angular/router';
import { BookAddDialogComponent } from '../book-add-dialog/book-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../services/book.service';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { GetAllUserBookByProfileIdUseCase } from 'src/app/core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { AuthService } from 'src/app/services/auth.service';
import { combineLatest } from 'rxjs';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { ChangeStatusUserBookUseCase } from 'src/app/core/use-cases/user-book/change-status-user-book.use-case';

@Component({
    selector: 'app-book-card',
    templateUrl: './book-card.component.html',
    styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {

    @Output() bookReturn = new EventEmitter<any>();

    @Input() book: any;

    @Input() deviceXs: boolean;

    @Input() idTag: any;

    @Input() logged: boolean;

    @Input() canEdit: boolean;

    bookStatus = BookStatus;

    routerlink: string;

    isUserBook: boolean;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private bookService: BookService,
        private getBookByIdUseCase: GetBookByIdUseCase,
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
        private changeStatusUserBookUseCase: ChangeStatusUserBookUseCase,
        private authGuard: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.isUserBook = this.router.url.includes('mybooks');
        if (!this.isUserBook) {
            if (!this.idTag) {
                this.routerlink = '/books/';
            } else {
                this.routerlink = '/book/' + this.idTag + '/';
            }
        } else {
            if (!this.idTag) {
                this.routerlink = '/books/';
            } else {
                this.routerlink = '/mybooks/' + this.idTag + '/';
            }
        }
    }


    changeStatusBook(bookStatus: BookStatus, idBook: number, book: Book) {
        const userBookUpdateStatusTO: any = {
            id: '68',
            status: mapBookStatus.get(bookStatus)
        };

        this.changeStatusUserBookUseCase.execute(userBookUpdateStatusTO).subscribe(value => {
            this.book.status = value.status;
            this.bookReturn.emit({ status: value.status, book });
        }, error => {
            console.log('Error', error);
        });
    }

    openDialogAddBook(book: Book) {
        const dialogRef = this.dialog.open(BookAddDialogComponent, {
            height: '450px',
            width: '400px',
            data: {
                book
            }
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getBook();
            this.bookService.updateListCarrousel.emit(true);
        });
    }

    getBook(): void {
        combineLatest([
            this.getAllUserBookByProfileIdUseCase.execute(this.authGuard.getUser().profile.id),
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
