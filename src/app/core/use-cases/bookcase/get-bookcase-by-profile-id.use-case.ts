import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { GetAllUserBookByProfileIdUseCase } from "../user-book/get-all-user-book-by-profile-id.case-use";
import { GetBookByIdUseCase } from "../book/get-book-by-id.use-case";
import { Bookcase } from "../../domain/entities/bookcase.entity";
import { forkJoin, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class GetBookcaseByProfileIdUseCase implements UseCaseInterface {
    constructor(
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
        private getBookByIdUseCase: GetBookByIdUseCase,
    ) { }

    execute(profileId: string): Observable<Bookcase> {
        return this.getAllUserBookByProfileIdUseCase.execute(profileId).pipe(
            switchMap(userBooks => {
                return forkJoin(userBooks.map(userBook => this.getBookByIdUseCase.execute(userBook.book.id, userBook.book.api))).pipe(
                    map(books => new Bookcase(undefined, undefined, books)),
                );
            })
        );
    }
}
