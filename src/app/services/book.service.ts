import { EventEmitter, Injectable, Output } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GetBookByIdUseCase } from '../core/use-cases/book/get-book-by-id.use-case';
import { GetAllUserBookByProfileIdUseCase } from '../core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { UserBook } from '../core/domain/entities/user-book.entity';
import { GetAllTagsByProfileIdTagUseCase } from '../core/use-cases/tag/get-all-tags-by-profile-id.use-case';
import { GetTagByIdUseCase } from '../core/use-cases/tag/get-tag-by-id.use-case';
import { Bookcase } from '../core/domain/entities/bookcase.entity';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    genres: string[] = ['ficção', 'classicos', 'romance', 'literatura'];
    @Output() updateListCarrousel = new EventEmitter<any>();

    constructor(
        private authGuard: AuthService,
        private getBookByIdUseCase: GetBookByIdUseCase,
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
        private getAllTagsByProfileIdTagUseCase: GetAllTagsByProfileIdTagUseCase,
        private getTagByIdUseCase: GetTagByIdUseCase,
    ) { }

    getAllBooksTags(): Observable<Bookcase[]> {
        return this.getAllTagsByProfileIdTagUseCase.execute(this.authGuard.getUser().profile.id).pipe(
            mergeMap(tags => {
                const observables = tags.map(tag => {
                    return new Bookcase(tag.id, tag.name, tag.userBooks);
                });

                return forkJoin(observables);
            })
        );
    }

    getAllBooks(): Observable<any> {
        return this.getAllUserBookByProfileIdUseCase.execute(this.authGuard.getUser().profile.id)
            .pipe(
                mergeMap(userBooks => {
                    return forkJoin(this.getBooksByUserBooks(userBooks));
                })
            );
    }

    getBookCaseByTag(tagId: string): Observable<Bookcase> {
        return this.getTagByIdUseCase.execute(tagId).pipe(
            map(tag => new Bookcase(tag.id, tag.name, tag.userBooks)),
            catchError(err => {
                console.error('BookService - error, getBookCaseByTag', err);
                return throwError(() => err);
            })
        );
    }

    getBooksByUserBooks(userBook: any): any[] {
        if (userBook.length > 0) {
            const userBooks: UserBook[] = userBook;
            return userBooks.map((userbook) => this.getBookByIdUseCase.execute(userbook.book.id, userbook.book.api));
        }
        return [];
    }
}
