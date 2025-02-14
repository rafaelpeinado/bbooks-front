import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { from, Observable } from "rxjs";
import { Bookcase } from "../../domain/entities/bookcase.entity";
import { GetTagByIdUseCase } from "../tag/get-tag-by-id.use-case";
import { mergeMap } from "rxjs/operators";
import { GetBookcaseByProfileIdUseCase } from "./get-bookcase-by-profile-id.use-case";

@Injectable({
    providedIn: 'root'
})
export class GetBookcaseByTagIdUseCase implements UseCaseInterface {
    constructor(
        private getTagByIdUseCase: GetTagByIdUseCase,
        private getBookcaseByProfileIdUseCase: GetBookcaseByProfileIdUseCase,
    ) { }

    execute(tagId: string): Observable<Bookcase> {
        return this.getTagByIdUseCase.execute(tagId).pipe(
            mergeMap((tag) => from(tag.userBooks)),
            mergeMap((userBook) => this.getBookcaseByProfileIdUseCase.execute(userBook.profileId.toString()))
        );
    }
}