import { Observable } from 'rxjs';
import { Book } from '../../domain/entities/book.entity';
import { UseCaseInterface } from '../use-case.interface';
import { Injectable } from '@angular/core';
import { BookServiceFactory } from 'src/app/infrastructure/adapters/factories/book-service.factory';
import { ApiType } from '../../domain/enums/api-type.enum';

@Injectable({
    providedIn: 'root'
})
export class AddBookUseCase implements UseCaseInterface {
    constructor(private readonly bookServiceFactory: BookServiceFactory) { }

    execute(book: Book): Observable<Book> {
        const bookRepository = this.bookServiceFactory.create(ApiType.BBOOKS);
        return bookRepository.addBook(book);
    }

}
