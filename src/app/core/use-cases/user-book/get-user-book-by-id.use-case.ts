import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { UserBook } from "../../domain/entities/user-book.entity";
import { Observable } from "rxjs";
import { UserBookRepository } from "../../repositories/user-book.repository";

@Injectable({
    providedIn: 'root'
})
export class GetUserBookByIdUseCase implements UseCaseInterface {
    constructor(private userBookRepository: UserBookRepository) { }

    execute(userBookId: string): Observable<UserBook> {
        return this.userBookRepository.getUserBookById(userBookId);
    }
}