import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { BookBuilder } from "src/app/core/domain/builders/book.builder";
import { Book } from "src/app/core/domain/entities/book.entity";
import { ApiType } from "src/app/core/domain/enums/api-type.enum";
import { FilterSearch } from "src/app/core/domain/interfaces/filter-search.interface";
import { PaginationInterface } from "src/app/core/domain/interfaces/pagination.interface";
import { BookRepository } from "src/app/core/repositories/book.repository";
import { environment } from "src/environments/environment";
import { SearchMergedBookTO } from "../dtos/search-book.dto";
import { ItemGoogleBooks } from "../dtos/google-books.dto";
import { ISBNGoogleEnum } from "../enums/isbn-google.enum";
import { Author } from "src/app/core/domain/entities/author.entity";

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
                const booksGoogle: Book[] = response.googleBooks.items.map((item) => this.convertItemGoogleBooksToBook(item));

                return {
                    content: books.concat(booksGoogle),
                    totalElements: totalItems,
                    size: size,
                    totalPages: totalPages,
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
            map((book) => new BookBuilder()
                .copyFrom(book)
                .setApi(ApiType.BBOOKS)
                .build()
            )
        );
    }

    searchBookByNamePagination(FilterSearch: FilterSearch): Observable<PaginationInterface<Book>> {
        throw new Error("Method not implemented.");
    }

    searchBookByName(bookName: string): Observable<Book[]> {
        throw new Error("Method not implemented.");
    }

    private convertItemGoogleBooksToBook(response: ItemGoogleBooks): Book {
        return new BookBuilder()
            .setId(response.id)
            .setIsbn10(this.getIsbn(response, ISBNGoogleEnum.ISBN_10))
            .setIsbn13(this.getIsbn(response, ISBNGoogleEnum.ISBN_13))
            .setTitle(response.volumeInfo.title)
            .setAuthors(this.getAuthors(response))
            .setNumberPage(response.volumeInfo.pageCount)
            .setLanguage(response.volumeInfo.language)
            .setPublisher(response.volumeInfo.publisher)
            .setPublishedDate(response.volumeInfo.publishedDate)
            // .setAverageRating(response.volumeInfo.a)
            .setImage(this.getImage(response))
            .setDescription(response.volumeInfo.description)
            .setApi(ApiType.GOOGLE)
            .build()
    }

    private getIsbn(response: ItemGoogleBooks, isbnGoogleEnum: ISBNGoogleEnum): string {
        return response.volumeInfo.industryIdentifiers.find((item) => item.type === isbnGoogleEnum)?.identifier;
    }

    private getAuthors(response: ItemGoogleBooks): Author[] {
        return response.volumeInfo.authors.map((author) => new Author(undefined, author));
    }

    private getImage(response: ItemGoogleBooks): string {
        const links = response.volumeInfo.imageLinks;
        if (links) {
            const thumbnail = links.thumbnail;
            return thumbnail
                .slice(0, thumbnail.indexOf('zoom=1') + 'zoom=1'.length)
                .concat('&source=gbs_api')
                .replace('http', 'https');
        }
        return '';
    }

    // TODO O book de update book era 
    // export class Book {
    //     id: string;
    //     isbn10: string;
    //     isbn13: string;
    //     title: string;
    //     authors: Author[];
    //     numberPage: number;
    //     language: string;
    //     publisher: string;
    //     // country: number;
    //     publishedDate: number;
    //     averageRating: number;
    //     image: string;
    //     description: string;
    //     status: BookStatus;
    //     idUserBook: number;
    //     tags: Tag[];
    //     api: string;
    //     finishDate: Date;
    // }
}