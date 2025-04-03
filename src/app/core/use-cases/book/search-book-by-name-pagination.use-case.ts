import { BookServiceFactory } from "src/app/infrastructure/adapters/factories/book-service.factory";
import { UseCaseInterface } from "../use-case.interface";
import { ApiType } from "../../domain/enums/api-type.enum";
import { Observable } from "rxjs";
import { Book } from "../../domain/entities/book.entity";
import { Injectable } from "@angular/core";
import { FilterSearch } from "../../domain/interfaces/filter-search.interface";
import { PaginationInterface } from "../../domain/interfaces/pagination.interface";

@Injectable({
    providedIn: 'root'
})
export class SearchBookByNamePaginationUseCase implements UseCaseInterface {
    constructor(private readonly bookServiceFactory: BookServiceFactory) { }

    execute(FilterSearch: FilterSearch): Observable<PaginationInterface<Book>> {
        const bookRepository = this.bookServiceFactory.create(ApiType.GOOGLE);
        return bookRepository.searchBookByNamePagination(FilterSearch);
    }

}