import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { BookBuilder } from "src/app/core/domain/builders/book.builder";
import { Author } from "src/app/core/domain/entities/author.entity";
import { Book } from "src/app/core/domain/entities/book.entity";
import { ApiType } from "src/app/core/domain/enums/api-type.enum";
import { FilterSearch } from "src/app/core/domain/interfaces/filter-search.interface";
import { PaginationInterface } from "src/app/core/domain/interfaces/pagination.interface";
import { BookRepository } from "src/app/core/repositories/book.repository";
import { ISBNGoogleEnum } from "src/app/infrastructure/enums/isbn-google.enum";
import { environment } from "src/environments/environment";
import { GoogleBooksOutputDto } from "../dtos/google-books.dto";

@Injectable({
    providedIn: 'root'
})
export class GoogleBooksApiService implements BookRepository {

    api: string = environment.googleBooksApi + 'books/v1/volumes/';

    constructor(private http: HttpClient) { }

    addBook(book: Book): Observable<Book> {
        throw new Error("Method not implemented.");
    }

    searchBooks(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        throw new Error("Method not implemented.");
    }

    getBookById(id: string): Observable<Book> {
        return this.http.get<GoogleBooksOutputDto>(this.api + id).pipe(
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

    private getIsbn(response: GoogleBooksOutputDto, isbnGoogleEnum: ISBNGoogleEnum): string {
        return response.volumeInfo.industryIdentifiers.find((item) => item.type === isbnGoogleEnum).identifier;
    }

    private getAuthors(response: GoogleBooksOutputDto): Author[] {
        return response.volumeInfo.authors.map((author) => new Author(undefined, author));
    }

    private getImage(response: GoogleBooksOutputDto): string {
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
