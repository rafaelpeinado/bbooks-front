import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from '../../../models/book.model';
import { BookStatus, mapBookStatus } from '../../../models/enums/BookStatus.enum';
import { Router } from '@angular/router';
import { UserbookService } from '../../../services/userbook.service';
import { BookAddDialogComponent } from '../book-add-dialog/book-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../../services/book.service';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';

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

    userBook: boolean;

    constructor(
        private router: Router,
        private userbookService: UserbookService,
        public dialog: MatDialog,
        private bookService: BookService,
        private getBookByIdUseCase: GetBookByIdUseCase,
    ) {
    }

    ngOnInit(): void {
        this.userBook = this.router.url.includes('mybooks');
        if (!this.userBook) {
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
        const userBookUpdateStatusTO = {
            id: idBook,
            status: mapBookStatus.get(bookStatus)
        };
        this.userbookService.changeStatus(userBookUpdateStatusTO).subscribe(value => {
            this.book.status = value.status;
            this.bookReturn.emit({ status: value.status, book });
        },
            error => {
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

        this.bookService.getAllUserBooks().subscribe((userbooks) => {
            this.getBookByIdUseCase.execute(this.book.id, this.book.api).subscribe((book) => {
                const bookBuilder = new BookBuilder().copyFrom(book);
                userbooks.forEach((userbook) => {
                    if (userbook.book.id === book.id) {
                        bookBuilder.copy()
                        .setStatus(userbook.status)
                        .setIdUserBook(+userbook.id)
                        .setFinishDate(userbook.finishDate);
                    }
                })
                this.book = bookBuilder.build();
                this.userBook = this.book.idUserBook ? true : false;
            });
        });
    }

    verifyrouter(): boolean {
        return this.router.url.includes('my');
    }


}
