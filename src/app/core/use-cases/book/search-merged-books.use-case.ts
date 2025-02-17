import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { ApiType } from '../../domain/enums/api-type.enum';
import { BookServiceFactory } from 'src/app/infrastructure/adapters/factories/book-service.factory';
import { FilterSearch } from '../../domain/interfaces/filter-search.interface';
import { Observable } from 'rxjs';
import { Book } from '../../domain/entities/book.entity';
import { PaginationInterface } from '../../domain/interfaces/pagination.interface';

@Injectable({
    providedIn: 'root'
})

export class SearchMergedBookUseCase implements UseCaseInterface {
    constructor(private bookServiceFactory: BookServiceFactory) { }

    execute(filterSearch: FilterSearch): Observable<PaginationInterface<Book>> {
        const bookRepository = this.bookServiceFactory.create(ApiType.BBOOKS);
        return bookRepository.searchMergedBook(filterSearch);
    }
}
