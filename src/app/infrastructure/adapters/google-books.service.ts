import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { FilterSearch } from 'src/app/core/domain/interfaces/filter-search.interface';
import { PaginationInterface } from 'src/app/core/domain/interfaces/pagination.interface';
import { BookRepository } from 'src/app/core/repositories/book.repository';
import { environment } from 'src/environments/environment';
import { ItemGoogleBooks, ListItemsGoogleBooks } from '../dtos/google-books.dto';
import { GoogleBooksMapper } from '../mappers/google-books.mapper';

@Injectable({
    providedIn: 'root'
})
export class GoogleBooksApiService implements BookRepository {

    private readonly api: string = environment.googleBooksApi + 'books/v1/volumes/';

    constructor(private readonly http: HttpClient) { }

    searchBookByNamePagination(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        const params = new HttpParams()
            .set('q', filter.input)
            .set('maxResults', filter.size.toString())
            .set('startIndex', filter.page.toString());

        return this.http.get<ListItemsGoogleBooks>(this.api, { params }).pipe(
            first(),
            map((response) => {
                const books: Book[] = response.items.map((item) => GoogleBooksMapper.toBook(item));

                const size = filter.size;
                const totalItems = response.totalItems;
                const totalPages = Math.ceil(totalItems / size);
                return {
                    content: books,
                    totalElements: totalItems,
                    size,
                    totalPages,
                    last: totalPages === filter.page,
                    pageable: undefined,
                };
            }),
        );
    }

    searchBookByName(bookName: string): Observable<Book[]> {
        const params = new HttpParams()
            .set('q', bookName);
        return this.http.get<ListItemsGoogleBooks>(this.api, { params }).pipe(
            first(),
            map((response) => response.items.map((item) => GoogleBooksMapper.toBook(item))),
        );
    }

    getBookById(id: string): Observable<Book> {
        return this.http.get<ItemGoogleBooks>(this.api + id).pipe(
            first(),
            map((response) => GoogleBooksMapper.toBook(response)),
        );
    }

    searchMergedBook(filterSearch: FilterSearch): Observable<PaginationInterface<Book>> {
        throw new Error('Method not implemented.');
    }

    addBook(book: Book): Observable<Book> {
        throw new Error('Method not implemented.');
    }

    searchBooks(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        throw new Error('Method not implemented.');
    }

    updateBook(book: Book): Observable<Book> {
        throw new Error('Method not implemented.');
    }
}
