import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { Book } from '../../../models/book.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';

@Injectable()
export class BookViewResolve implements Resolve<Book> {
    userbooks;
    constructor(
        private bookService: BookService,
        private getBookByIdUseCase: GetBookByIdUseCase,
    ) {
        this.bookService.getAllUserBooks().subscribe((userbooks) => {
            this.userbooks = userbooks;
        });
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const api = route.queryParams.api;
        const id = route.params.id;


        this.getBookByIdUseCase.execute(id, api).pipe(
            map((response) => {
                const bookBuilder = new BookBuilder().copyFrom(response).setApi(api);
                this.userbooks.books.array.forEach(userbook => {
                    bookBuilder.copy()
                        .setIdUserBook(userbook.id)
                        .setStatus(userbook.status)
                        .setFinishDate(userbook.finishDate);
                });
                return bookBuilder.build();
            }),
        );
    }
}
