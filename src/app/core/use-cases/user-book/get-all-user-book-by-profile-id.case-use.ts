import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { Observable } from 'rxjs';
import { UserBook } from '../../domain/entities/user-book.entity';
import { GetCachedUserUseCase } from '../user/get-cached-user.use-case';
import { User } from '../../domain/entities/user.entity';
import { UserBookRepository } from '../../repositories/user-book.repository';

@Injectable({
    providedIn: 'root'
})
export class GetAllUserBookByProfileIdUseCase implements UseCaseInterface {
    constructor(
        private readonly userBookRepository: UserBookRepository,
        private readonly getCachedUserUseCase: GetCachedUserUseCase,
    ) { }

    execute(): Observable<UserBook[]> {
        const user: User = this.getCachedUserUseCase.execute();
        return this.userBookRepository.getAllUserBooksByProfileId(user.profile.id);
    }
}
