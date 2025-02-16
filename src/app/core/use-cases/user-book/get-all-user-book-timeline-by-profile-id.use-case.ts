import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { Observable } from 'rxjs';
import { UserBookApiService } from 'src/app/infrastructure/adapters/user-book.service';
import { UserBook } from '../../domain/entities/user-book.entity';
import { GetCachedUserUseCase } from '../user/get-cached-user.use-case';
import { User } from '../../domain/entities/user.entity';

@Injectable({
    providedIn: 'root'
})
export class GetAllBookCaseTimelineByProfileIdUseCase implements UseCaseInterface {
    constructor(
        private userBookApiService: UserBookApiService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) { }

    execute(): Observable<UserBook[]> {
        const user: User = this.getCachedUserUseCase.execute();
        return this.userBookApiService.getAllUserBookTimelineByProfileId(user.profile.id);
    }
}
