import { Injectable } from '@angular/core';
import { Book } from '../../domain/entities/book.entity';
import { Observable, of } from 'rxjs';
import { UseCaseApiInterface } from '../use-case.interface';
import { BookServiceFactory } from 'src/app/infrastructure/adapters/factories/book-service.factory';
import { ApiType } from '../../domain/enums/api-type.enum';
import { switchMap, tap } from 'rxjs/operators';
import { GetCacheUseCase } from '../cache/get-cache.use-case';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { SetCacheUseCase } from '../cache/set-cache.use-case';
import { SetCache } from '../../domain/interfaces/set-cache.interface';

@Injectable({
    providedIn: 'root'
})
export class GetBookByIdUseCase implements UseCaseApiInterface<ApiType> {
    constructor(
        private bookServiceFactory: BookServiceFactory,
        private getCacheUseCase: GetCacheUseCase,
        private setCacheUseCase: SetCacheUseCase,
    ) { }

    execute(bookId: string, api: ApiType): Observable<Book> {
        return this.getBookFromCache(bookId).pipe(
            switchMap((book) => book ? of(book) : this.getBookFromService(bookId, api))
        );
    }

    private getBookFromCache(bookId: string): Observable<Book> {
        const books: Book[] = this.getCacheUseCase.execute<Book[]>(StorageItem.BOOKS, StorageType.LOCAL_STORAGE) ?? [];
        const book: Book = books.find(book => book.id === bookId);
        return of(book);
    }

    private getBookFromService(bookId: string, api: ApiType): Observable<Book> {
        const bookRepository = this.bookServiceFactory.getService(api);
        return bookRepository.getBookById(bookId)
            .pipe(tap((book) => this.addBookToCache(book)));
    }

    private addBookToCache(book: Book): void {
        const books: Book[] = this.getCacheUseCase.execute<Book[]>(StorageItem.BOOKS, StorageType.LOCAL_STORAGE) ?? [];
        if (!books.some(b => b.id === book.id)) {
            const setCache: SetCache<Book[]> = { value: [...books, book], storageItem: StorageItem.BOOKS };
            this.setCacheUseCase.execute<Book[]>(setCache, StorageType.LOCAL_STORAGE);
        }
    }
}
