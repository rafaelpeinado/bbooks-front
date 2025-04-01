import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { GenresEnum } from 'src/app/core/domain/enums/genres.enum';
import { map, mergeMap, scan, startWith } from 'rxjs/operators';
import { SearchBookByNameUseCase } from 'src/app/core/use-cases/book/search-book-by-name.use-case';
import { Bookcase } from 'src/app/core/domain/entities/bookcase.entity';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { UserBookBuilder } from 'src/app/core/domain/builders/user-book.builder';

@Injectable()
export class BooksResolve implements Resolve<Bookcase[]> {
    constructor(
        private searchBookByNameUseCase: SearchBookByNameUseCase,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return from(Object.keys(GenresEnum)).pipe(
            mergeMap(
                (key) => this.searchBookByNameUseCase.execute(GenresEnum[key]).pipe(
                    map((books) => {
                        const userBooks: UserBook[] = books.map((book) => UserBookBuilder.builder().setBook(book).build());
                        return new Bookcase(GenresEnum[key], GenresEnum[key], userBooks);
                    })
                )
            ),
            scan((bookcases: Bookcase[], bookcase: Bookcase) => [...bookcases, bookcase], []),
            startWith([])
        );
    }
}
