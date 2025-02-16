import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { UserBook } from "../../domain/entities/user-book.entity";
import { UserBookApiService } from "src/app/infrastructure/adapters/user-book.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GetUserBookByIdUseCase implements UseCaseInterface {
    constructor(private userBookApiService: UserBookApiService) { }

    execute(userBookId: string): Observable<UserBook> {
        return this.userBookApiService.getUserBookById(userBookId);
    }
}