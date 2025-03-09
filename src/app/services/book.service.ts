import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GetAllTagsByProfileIdTagUseCase } from '../core/use-cases/tag/get-all-tags-by-profile-id.use-case';
import { GetTagByIdUseCase } from '../core/use-cases/tag/get-tag-by-id.use-case';
import { Bookcase } from '../core/domain/entities/bookcase.entity';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    constructor(
        private readonly getAllTagsByProfileIdTagUseCase: GetAllTagsByProfileIdTagUseCase,
        private readonly getTagByIdUseCase: GetTagByIdUseCase,
    ) { }

    getAllBooksTags(): Observable<Bookcase[]> {
        return this.getAllTagsByProfileIdTagUseCase.execute().pipe(
            mergeMap(tags => {
                const observables = tags.map(tag => {
                    return new Bookcase(tag.id, tag.name, tag.userBooks);
                });

                return forkJoin(observables);
            })
        );
    }

    getBookCaseByTag(tagId: string): Observable<Bookcase> {
        return this.getTagByIdUseCase.execute(tagId).pipe(
            map(tag => new Bookcase(tag.id, tag.name, tag.userBooks)),
            catchError(err => {
                console.error('BookService - error, getBookCaseByTag', err);
                return throwError(() => err);
            })
        );
    }
}
