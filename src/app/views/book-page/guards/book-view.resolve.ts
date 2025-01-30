import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { AuthService } from 'src/app/services/auth.service';
import { GetAllUserBookByProfileIdUseCase } from 'src/app/core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { UserBookDetails } from 'src/app/core/domain/interfaces/user-book-details.interface';
import { Book } from 'src/app/core/domain/entities/book.entity';

@Injectable()
export class BookViewResolve implements Resolve<UserBookDetails> {
    userbooks;
    constructor(
        private getBookByIdUseCase: GetBookByIdUseCase,
        private authGuard: AuthService,
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const api = route.queryParams.api;
        const id = route.params.id;

        return combineLatest([
            this.getAllUserBookByProfileIdUseCase.execute(this.authGuard.getUser().profile.id),
            this.getBookByIdUseCase.execute(id, api)
        ]).pipe(
            map((value) => {
                const userBooks: UserBook[] = value[0];
                const book: Book = value[1];
                const userBook: UserBook = userBooks.find((userBook) => userBook.book.id === book.id);

                const userBookDetails: UserBookDetails = {
                    userBook,
                    book,
                };

                return userBookDetails;
            }));
    }
}
