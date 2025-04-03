import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { Observable } from 'rxjs';
import { Bookcase } from '../../domain/entities/bookcase.entity';
import { map } from 'rxjs/operators';
import { GetAllUserBookByProfileIdUseCase } from '../user-book/get-all-user-book-by-profile-id.case-use';
import { UserBook } from '../../domain/entities/user-book.entity';

@Injectable({
    providedIn: 'root'
})
export class GetBookcaseByTagIdUseCase implements UseCaseInterface {
    constructor(
        private readonly getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
    ) { }

    execute(tagId: string): Observable<Bookcase> {
        return this.getAllUserBookByProfileIdUseCase.execute().pipe(
            map((userBooks) => {
                const userBooksByTagId: UserBook[] = userBooks.filter((userBook) => userBook.tags.find((tag) => tag.id === tagId));
                return new Bookcase(undefined, undefined, userBooksByTagId);
            })
        );
    }
}
