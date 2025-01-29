import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { Observable } from 'rxjs';
import { BookCase } from '../../../models/bookCase.model';
import { of } from 'rxjs';
import { SearchBookByNameUseCase } from 'src/app/core/use-cases/book/search-book-by-name.use-case';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';


@Injectable()
export class BookEstanteResolve implements Resolve<Book[]> {

    constructor(
        private bookService: BookService,
        private searchBookByNameUseCase: SearchBookByNameUseCase,
    ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const myBook = route.url.toString().includes('my');
        const tag = route.params.tag;
        const bookCase = new BookCase();
        bookCase.books = [];
        bookCase.description = tag;
        bookCase.id = tag;
        if (myBook) {
            if (tag) {
                return this.bookService.getBookCaseByTag(tag);
            } else {
                this.bookService.getAllBooks().subscribe(books => {
                    bookCase.books = books;
                },
                    error => console.log('errro', error));
            }
        } else {
            this.searchBookByNameUseCase.execute(tag).subscribe((books) => bookCase.books = books);
        }
        return of(bookCase);
    }
}
