import { EventEmitter, Injectable, Output } from '@angular/core';
import { BookCase } from '../models/bookCase.model';
import { Book } from '../models/book.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, zip } from 'rxjs';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { GetBookByIdUseCase } from '../core/use-cases/book/get-book-by-id.use-case';
import { BookBuilder } from '../core/domain/builders/book.builder';
import { SearchBookByNameUseCase } from '../core/use-cases/book/search-book-by-name.use-case';
import { GetAllUserBookByProfileIdUseCase } from '../core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { UserBook } from '../core/domain/entities/user-book.entity';
import { GetAllTagsByProfileIdTagUseCase } from '../core/use-cases/tag/get-all-tags-by-profile-id.use-case';
import { GetTagByIdUseCase } from '../core/use-cases/tag/get-tag-by-id.use-case';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    genres: string[] = ['ficção', 'classicos', 'romance', 'literatura'];

    @Output() updateListCarrousel = new EventEmitter<any>();

    constructor(
        private authGuard: AuthService,
        private getBookByIdUseCase: GetBookByIdUseCase,
        private searchBookByNameUseCase: SearchBookByNameUseCase,
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
        private getAllTagsByProfileIdTagUseCase: GetAllTagsByProfileIdTagUseCase,
        private getTagByIdUseCase: GetTagByIdUseCase,
    ) { }

    getAllBooksTags() {
        const result = [];
        this.getAllTagsByProfileIdTagUseCase.execute(this.authGuard.getUser().profile.id)
            .subscribe(tags => {
                tags.forEach(tag => {
                    const bc = new BookCase();
                    bc.id = tag.id;
                    bc.description = tag.name;
                    bc.books = [];
                    if (tag.userBooks) {
                        zip(
                            ...this.getBooksByUserBooks(tag.userBooks)
                        ).subscribe((books: Book[]) => {
                            bc.books = books;
                            result.push(bc);
                        });
                    }
                });
            });
        return of(result);
    }

    getAllBooks(): Observable<any> {
        return this.getAllUserBookByProfileIdUseCase.execute(this.authGuard.getUser().profile.id)
            .pipe(
                mergeMap(userBooks => {
                    return zip(
                        ...this.getBooksByUserBooks(userBooks)
                    );
                })
            );
    }

    getBookCaseByTag(tagId: string): Observable<BookCase> {
        // @ts-ignore
        return this.getTagByIdUseCase.execute(tagId)
            .pipe(
                mergeMap(tag => {
                    const result = new BookCase();
                    result.books = [];
                    result.description = tag.name;
                    result.id = tag.id;
                    if (tag?.userBooks?.length > 0) {
                        return zip(
                            ...this.getBooksByUserBooks(tag.userBooks)
                        ).pipe(
                            map((books: Book[]) => {
                                result.books = books;
                                return result;
                            })
                        );
                    }
                    return of(result);
                }),
                catchError((err => {
                    console.log('BookService - error, getBookCaseByTag', err);
                    return throwError(err);
                })
                ));
    }

    getBooksByUserBooks(userBook: any): any[] {
        if (userBook.length > 0) {
            const userBooks: UserBook[] = userBook;
            return userBooks.map((userbook) => this.getBookByIdUseCase.execute(userbook.book.id, userbook.book.api));
        }
        // return userBook.map(realation => {
        //     return this.getBookByIdUseCase.execute(userBook.book.id, userBook.book.apiType).pipe(
        //         map((book) => new BookBuilder()
        //             .copyFrom(book)
        //             .setIdUserBook(realation.id)
        //             .setStatus(realation.status)
        //             .build()
        //         )
        //     )
        // });
    }

    getAllBookGoogle() {
        const result = [];

        this.genres.forEach(genre => {
            const bc = new BookCase();
            bc.books = [];
            bc.description = genre;
            bc.id = genre;
            this.searchBookByNameUseCase.execute(genre).subscribe((books) => {
                bc.books = books.map((book) => new BookBuilder()
                    .copyFrom(book)
                    .build()
                );
                result.push(bc);
            });
        });
        return of(result);
    }
}
