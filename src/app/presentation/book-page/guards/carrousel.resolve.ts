import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchBookByNameUseCase } from 'src/app/core/use-cases/book/search-book-by-name.use-case';
import { Bookcase } from 'src/app/core/domain/entities/bookcase.entity';
import { Book } from 'src/app/core/domain/entities/book.entity';

@Injectable()
export class CarrouselResolve implements Resolve<Book[]> {

    constructor(
        private searchBookByNameUseCase: SearchBookByNameUseCase,
    ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const myBook = route.url.toString().includes('my');
        const bookcaseDescripton = route.params.bookcase;
        const bookcase = new Bookcase(undefined, undefined, []);
        if (myBook) {
            // bookcase = this.bookService.getBookCaseByDescription(bookcaseDescripton);
            if (bookcase) {
                return bookcase;
            }
        } else {
            this.searchBookByNameUseCase.execute(bookcaseDescripton).subscribe((books) => {
                return books;
            });
        }
    }
}
