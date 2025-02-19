import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { FilterSearch } from 'src/app/core/domain/interfaces/filter-search.interface';
import { PaginationInterface } from 'src/app/core/domain/interfaces/pagination.interface';
import { BookRepository } from 'src/app/core/repositories/book.repository';
import { environment } from 'src/environments/environment';
import { SearchMergedBookTO } from '../dtos/search-book.dto';
import { GoogleBooksMapper } from '../mappers/google-books.mapper';

@Injectable({
    providedIn: 'root'
})
export class BookApiService implements BookRepository {

    private api: string = environment.api + 'books/';

    constructor(private http: HttpClient) { }

    updateBook(book: Book): Observable<Book> {
        return this.http.put<Book>(this.api + book.id, book);
    }

    searchMergedBook(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        const bookSearch = {
            page: filter.page,
            search: filter.input,
        };

        const params = new HttpParams()
            .set('size', filter.size.toString());
        return this.http.post<SearchMergedBookTO>(this.api + 'searchByString', bookSearch, { params }).pipe(
            first(),
            map((response) => {
                const size = filter.size;
                const totalItems = response.books.totalElements + response.googleBooks.totalItems;
                const totalPages = Math.ceil(totalItems / size);

                const books: Book[] = response.books.content;
                const booksGoogle: Book[] = response.googleBooks.items.map((item) => GoogleBooksMapper.toBook(item));

                return {
                    content: books.concat(booksGoogle),
                    totalElements: totalItems,
                    size,
                    totalPages,
                    last: totalPages === filter.page,
                    pageable: undefined,
                };
            })
        );
    }

    addBook(book: Book): Observable<Book> {
        return this.http.post<Book>(this.api, book).pipe(first());
    }

    searchBooks(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        const params = new HttpParams()
            .set('search', filter.input)
            .set('page', filter.page.toString())
            .set('size', filter.size.toString());
        return this.http.get<PaginationInterface<Book>>(this.api + 'search', { params }).pipe(first());
    }

    getBookById(id: string): Observable<Book> {
        return this.http.get<Book>(this.api + id).pipe(
            map((book) => BookBuilder.builder()
                .copyFrom(book)
                .setApi(ApiType.BBOOKS)
                .build()
            )
        );
    }

    searchBookByNamePagination(FilterSearch: FilterSearch): Observable<PaginationInterface<Book>> {
        throw new Error('Method not implemented.');
    }

    searchBookByName(bookName: string): Observable<Book[]> {
        throw new Error('Method not implemented.');
    }
}
