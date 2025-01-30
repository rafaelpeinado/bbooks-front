import { Observable } from "rxjs";
import { Book } from "../../domain/entities/book.entity";
import { UseCaseInterface } from "../use-case.interface";
import { Injectable } from "@angular/core";
import { FilterSearch } from "../../domain/interfaces/filter-search.interface";
import { PaginationInterface } from "../../domain/interfaces/pagination.interface";
import { BookServiceFactory } from "src/app/infrastructure/adapters/factories/book-service.factory";
import { ApiType } from "../../domain/enums/api-type.enum";

@Injectable({
    providedIn: 'root'
})
export class SearchBooksUseCase implements UseCaseInterface {
    constructor(private bookServiceFactory: BookServiceFactory) { }

    execute(filter: FilterSearch): Observable<PaginationInterface<Book>> {
        const bookRepository = this.bookServiceFactory.getService(ApiType.BBOOKS);
        return bookRepository.searchBooks(filter);
    }
}
