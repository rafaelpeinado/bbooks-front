import { GoogleBooksApiService } from '../google-books.service';
import { BookApiService } from '../book.service';
import { BookRepository } from 'src/app/core/repositories/book.repository';
import { Injectable } from '@angular/core';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { FactoryApi } from './factory.factory';

@Injectable({
    providedIn: 'root'
})
export class BookServiceFactory extends FactoryApi<BookRepository> {

    constructor(
        private googleBooksApiService: GoogleBooksApiService,
        private bookApiService: BookApiService,
    ) {
        super();
    }

    create(apiType: ApiType): BookRepository {
        if (apiType === ApiType.GOOGLE) {
            return this.googleBooksApiService;
        }
        return this.bookApiService;
    }
}
