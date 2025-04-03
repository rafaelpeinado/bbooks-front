import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { GetAllUserBookByProfileIdUseCase } from '../user-book/get-all-user-book-by-profile-id.case-use';
import { Bookcase } from '../../domain/entities/bookcase.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GetBookcaseByProfileIdUseCase implements UseCaseInterface {
    constructor(
        private readonly getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
    ) { }

    execute(): Observable<Bookcase> {
        return this.getAllUserBookByProfileIdUseCase.execute().pipe(
            map(userBooks => new Bookcase(undefined, undefined, userBooks))
        );
    }
}
