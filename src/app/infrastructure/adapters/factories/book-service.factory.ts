import { GoogleBooksApiService } from "../google-books.service";
import { BookApiService } from "../book.service";
import { BookRepository } from "src/app/core/repositories/book.repository";
import { Injectable } from "@angular/core";
import { ApiType } from "src/app/core/domain/enums/api-type.enum";

@Injectable({
    providedIn: 'root'
})
export class BookServiceFactory {
    private serviceMap: Map<ApiType, BookRepository>;


    constructor(
        private googleBooksApiService: GoogleBooksApiService,
        private bookApiService: BookApiService,
    ) {
        this.serviceMap = new Map<ApiType, BookRepository>([
            [ApiType.GOOGLE, this.googleBooksApiService],
            [ApiType.BBOOKS, this.bookApiService]
        ]);
    }

    public getService(apiType: ApiType): BookRepository {
        const service = this.serviceMap.get(apiType);
        if (!service) {
            throw new Error(`Unknown API type: ${apiType}`);
        }
        return service;
    }
}
