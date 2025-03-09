import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bookcase } from 'src/app/core/domain/entities/bookcase.entity';
import { TemporaryService } from 'src/app/services/temporary.service';

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnDestroy {
    public bookcases: Bookcase[];
    inscricao: Subscription;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly bookService: BookService,
        private readonly router: Router,
        private readonly temporaryService: TemporaryService,
    ) {
    }

    ngOnInit(): void {
        this.inscricao = this.route.data.subscribe((data: { bookcases: Bookcase[] }) => {
            this.bookcases = data.bookcases;
        });

        this.temporaryService.updateListCarrousel.subscribe(updated => {
            if (updated) {
                const myBook = this.router.url.toString().includes('mybooks');
                if (myBook) {
                    this.bookService.getAllBooksTags().subscribe(
                        bcs => {
                            this.bookcases = bcs;
                        }, error => console.log('error booksComponent', error));
                }
            }
        });
    }
    ngOnDestroy(): void {
        this.inscricao.unsubscribe();
    }

    updateBooksStatus(event) {
        this.bookcases.forEach(bookcases => {
            bookcases.userBooks.forEach(userBook => {
                if (userBook.book.id === event.idbook) {
                    userBook.status = event.status;
                }
            });
        });
    }

}
