import { Injectable } from '@angular/core';
import { Book } from '../../domain/entities/book.entity';
import { Observable, of } from 'rxjs';
import { UseCaseApiInterface } from '../use-case.interface';
import { BookServiceFactory } from 'src/app/infrastructure/adapters/factories/book-service.factory';
import { ApiType } from '../../domain/enums/api-type.enum';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GetBookByIdUseCase implements UseCaseApiInterface {
    constructor(private bookServiceFactory: BookServiceFactory) { }

    execute(bookId: string, api: ApiType): Observable<Book> {
        const cachedBook = this.getBookFromCache(bookId);
        if (cachedBook) {
            return of(cachedBook);
        }
        const bookRepository = this.bookServiceFactory.getService(api);
        return bookRepository.getBookById(bookId)
            .pipe(tap((book) => this.addBookToCache(book)));
    }

    private getBookFromCache(bookId: string): Book | null {
        const books: Book[] = JSON.parse(localStorage.getItem('books') ?? '[]');
        return books.find(book => book.id === bookId) || null;
    }

    private addBookToCache(book: Book): void {
        const books: Book[] = JSON.parse(localStorage.getItem('books') ?? '[]');
        if (!books.some(b => b.id === book.id)) {
            books.push(book);
            localStorage.setItem('books', JSON.stringify(books));
        }
    }
}
