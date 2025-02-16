import { BookServiceFactory } from 'src/app/infrastructure/adapters/factories/book-service.factory';
import { UseCaseInterface } from '../use-case.interface';
import { ApiType } from '../../domain/enums/api-type.enum';
import { Observable } from 'rxjs';
import { Book } from '../../domain/entities/book.entity';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SearchBookByNameUseCase implements UseCaseInterface {
    constructor(private bookServiceFactory: BookServiceFactory) { }

    execute(bookName: string): Observable<Book[]> {
        const bookRepository = this.bookServiceFactory.getService(ApiType.GOOGLE);
        return bookRepository.searchBookByName(bookName);
    }

}
