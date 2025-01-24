import { Injectable } from "@angular/core";
import { Book } from "../../domain/entities/book.entity";
import { Observable } from "rxjs";
import { UseCaseApiInterface } from "../use-case.interface";
import { BookServiceFactory } from "src/app/infrastructure/adapters/factories/book-service.factory";
import { ApiType } from "../../domain/enums/api-type.enum";

@Injectable({
    providedIn: 'root'
})
export class GetBookByIdUseCase implements UseCaseApiInterface {
    constructor(private bookServiceFactory: BookServiceFactory) { }

    execute(bookId: string, api: ApiType): Observable<Book> {
        const bookRepository = this.bookServiceFactory.getService(api);
        return bookRepository.getBookById(bookId);
    }
}
