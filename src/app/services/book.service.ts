import { EventEmitter, Injectable, Output } from '@angular/core';
import { BookCase } from '../models/bookCase.model';
import { Book } from '../models/book.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, zip } from 'rxjs';
import { Author } from '../models/author.model';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { TagService } from './tag.service';
import { BookPagination } from '../models/pagination/book.pagination';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { BookSearchTO } from '../models/bookSearchTO.model';
import { ApiType } from '../core/domain/enums/api-type.enum';
import { GetBookByIdUseCase } from '../core/use-cases/book/get-book-by-id.use-case';
import { BookBuilder } from '../core/domain/builders/book.builder';
import { SearchBookByNameUseCase } from '../core/use-cases/book/search-book-by-name.use-case';
import { GetAllUserBookByProfileIdUseCase } from '../core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { UserBook } from '../core/domain/entities/user-book.entity';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    genres: string[] = ['ficção', 'classicos', 'romance', 'literatura'];

    @Output() updateListCarrousel = new EventEmitter<any>();

    api = environment.api + 'books/';

    constructor(
        private http: HttpClient,
        private authGuard: AuthService,
        private tagService: TagService,
        private getBookByIdUseCase: GetBookByIdUseCase,
        private searchBookByNameUseCase: SearchBookByNameUseCase,
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
    ) {
    }

    getAllTags() {
        return this.tagService.getAllByProfile(this.authGuard.getUser().profile.id);
    }

    getAllBooksTags() {
        const result = [];
        this.getAllTags().subscribe(tags => {
            tags.forEach(tag => {
                const bc = new BookCase();
                bc.id = tag.id;
                bc.description = tag.name;
                bc.books = [];
                if (tag.books) {
                    zip(
                        ...this.getBooksByUserBooks(tag.books)
                    ).subscribe((books: Book[]) => {
                        bc.books = books;
                        result.push(bc);
                    });
                }
            });
        });
        return of(result);
    }

    getAllUserBooks(): Observable<UserBook[]> {
        return this.getAllUserBookByProfileIdUseCase.execute(this.authGuard.getUser().profile.id);
    }

    getAllBooks(): Observable<any> {
        return this.getAllUserBooks()
            .pipe(
                mergeMap(userBooks => {
                    return zip(
                        ...this.getBooksByUserBooks(userBooks)
                    );
                })
            );
    }

    getBookCaseByTag(tagId: number): Observable<BookCase> {

        // @ts-ignore
        return this.tagService.getById(tagId)
            .pipe(
                mergeMap(tag => {
                    const result = new BookCase();
                    result.books = [];
                    result.description = tag.name;
                    result.id = tag.id;
                    if (tag?.books?.length > 0) {
                        return zip(
                            ...this.getBooksByUserBooks(tag.books)
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

    convertBookToModel(book: any): Book {
        const b = new Book();
        b.authors = [];
        b.id = book.id;
        b.api = ApiType.GOOGLE;
        if (book.volumeInfo) {
            if (book.volumeInfo.industryIdentifiers) {
                b.isbn10 = book.volumeInfo.industryIdentifiers[0]?.identifier;
                b.isbn13 = book.volumeInfo.industryIdentifiers[1]?.identifier;
            }
            b.title = book.volumeInfo.title;
            b.publisher = book.volumeInfo.publisher;
            // b.country = book.saleInfo.country;
            b.language = book.volumeInfo.language;
            b.numberPage = book.volumeInfo.pageCount;
            b.publishedDate = book.volumeInfo.publishedDate;
            b.averageRating = book.volumeInfo.averageRating;
            if (book.volumeInfo.imageLinks) {
                b.image = book.volumeInfo.imageLinks.thumbnail;
                b.image = b.image.slice(0, b.image.indexOf('zoom=1') + 'zoom=1'.length);
                b.image = b.image + '&source=gbs_api';
                b.image = 'https' + b.image.substr(4, b.image.length);
            }
            b.description = book.volumeInfo.description;
            b.authors = this.convertAuthorToModel(book.volumeInfo.authors);
        }
        return b;
    }

    convertBookToBookList(books: any[]): Book[] {
        return books.map(value => this.convertBookToModel(value));
    }

    update(book: Book): Observable<Book> {
        return this.http.put<Book>(this.api + book.id, book);
    }

    convertAuthorToModel(authors: any[]): Author[] {
        const result = new Array<Author>();
        if (authors) {
            authors.map((name) => {
                const a = new Author();
                a.name = name;
                result.push(a);
            });
        }

        return result;
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

    search(search: string, size: number, page: number): Observable<BookPagination> {
        const params = new HttpParams()
            .set('search', search)
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<BookPagination>(this.api + 'search', { params });
    }

    searchMergeBooks(bookSearch: BookSearchTO, size: number): Observable<BookSearchTO> {
        const params = new HttpParams()
            .set('size', size.toString());
        return this.http.post<BookSearchTO>(this.api + 'searchByString', bookSearch, { params });
    }
}
