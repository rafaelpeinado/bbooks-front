import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { first, map, tap } from "rxjs/operators";
import { BookBuilder } from "src/app/core/domain/builders/book.builder";
import { Author } from "src/app/core/domain/entities/author.entity";
import { Book } from "src/app/core/domain/entities/book.entity";
import { ApiType } from "src/app/core/domain/enums/api-type.enum";
import { FilterSearch } from "src/app/core/domain/interfaces/filter-search.interface";
import { PaginationInterface } from "src/app/core/domain/interfaces/pagination.interface";
import { BookRepository } from "src/app/core/repositories/book.repository";
import { ISBNGoogleEnum } from "src/app/infrastructure/enums/isbn-google.enum";
import { environment } from "src/environments/environment";
import { ItemGoogleBooks, ListItemsGoogleBooks } from "../dtos/google-books.dto";

@Injectable({
    providedIn: 'root'
})
export class GoogleBooksApiService implements BookRepository {

    private api: string = environment.googleBooksApi + 'books/v1/volumes/';

    constructor(private http: HttpClient) { }

    searchBookByNamePagination(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        const params = new HttpParams()
            .set('q', filter.input)
            .set('maxResults', filter.size.toString())
            .set('startIndex', filter.page.toString());

        return this.http.get<ListItemsGoogleBooks>(this.api, { params }).pipe(
            first(),
            map((response) => {
                const books: Book[] = response.items.map((item) => new BookBuilder()
                    .setId(item.id)
                    .setIsbn10(this.getIsbn(item, ISBNGoogleEnum.ISBN_10))
                    .setIsbn13(this.getIsbn(item, ISBNGoogleEnum.ISBN_13))
                    .setTitle(item.volumeInfo.title)
                    .setAuthors(this.getAuthors(item))
                    .setNumberPage(item.volumeInfo.pageCount)
                    .setLanguage(item.volumeInfo.language)
                    .setPublisher(item.volumeInfo.publisher)
                    .setPublishedDate(item.volumeInfo.publishedDate)
                    // .setAverageRating(item.volumeInfo.a)
                    .setImage(this.getImage(item))
                    .setDescription(item.volumeInfo.description)
                    // .setStatus()
                    // .setIdUserBook()
                    // .setTags()
                    .setApi(ApiType.GOOGLE)
                    // .setFinishDate()
                    .build()
                );
                const size = filter.size;
                const totalItems = response.totalItems;
                const totalPages = Math.ceil(totalItems / size);
                return {
                    content: books,
                    totalElements: totalItems,
                    size: size,
                    totalPages: totalPages,
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
            map((response) => {
                return response.items.map((item) => new BookBuilder()
                    .setId(item.id)
                    .setIsbn10(this.getIsbn(item, ISBNGoogleEnum.ISBN_10))
                    .setIsbn13(this.getIsbn(item, ISBNGoogleEnum.ISBN_13))
                    .setTitle(item.volumeInfo.title)
                    .setAuthors(this.getAuthors(item))
                    .setNumberPage(item.volumeInfo.pageCount)
                    .setLanguage(item.volumeInfo.language)
                    .setPublisher(item.volumeInfo.publisher)
                    .setPublishedDate(item.volumeInfo.publishedDate)
                    // .setAverageRating(item.volumeInfo.a)
                    .setImage(this.getImage(item))
                    .setDescription(item.volumeInfo.description)
                    // .setStatus()
                    // .setIdUserBook()
                    // .setTags()
                    .setApi(ApiType.GOOGLE)
                    // .setFinishDate()
                    .build()
                );
            }),
        );
    }

    addBook(book: Book): Observable<Book> {
        throw new Error("Method not implemented.");
    }

    searchBooks(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        throw new Error("Method not implemented.");
    }

    getBookById(id: string): Observable<Book> {
        return this.http.get<ItemGoogleBooks>(this.api + id).pipe(
            first(),
            map((response) => new BookBuilder()
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
                // .setStatus()
                // .setIdUserBook()
                // .setTags()
                .setApi(ApiType.GOOGLE)
                // .setFinishDate()
                .build()
            ),
        );
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
}
