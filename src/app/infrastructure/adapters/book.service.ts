import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BookBuilder } from "src/app/core/domain/builders/book.builder";
import { Book } from "src/app/core/domain/entities/book.entity";
import { ApiType } from "src/app/core/domain/enums/api-type.enum";
import { FilterSearch } from "src/app/core/domain/interfaces/filter-search.interface";
import { PaginationInterface } from "src/app/core/domain/interfaces/pagination.interface";
import { BookRepository } from "src/app/core/repositories/book.repository";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class BookApiService implements BookRepository {

    api: string = environment.api + 'books/';

    constructor(private http: HttpClient) { }

    addBook(book: Book): Observable<Book> {
        return this.http.post<Book>(this.api, book);
    }

    searchBooks(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        const params = new HttpParams()
            .set('search', filter.input)
            .set('page', filter.page.toString())
            .set('size', filter.size.toString());
        return this.http.get<PaginationInterface<Book>>(this.api + 'search', { params });
    }

    getBookById(id: string): Observable<Book> {
        return this.http.get<Book>(this.api + id).pipe(
            map((book) => new BookBuilder()
                .copyFrom(book)
                .setApi(ApiType.BBOOKS)
                .build()
            )
        );
    }
}