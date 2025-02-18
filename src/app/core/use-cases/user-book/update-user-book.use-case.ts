import { UseCaseInterface } from '../use-case.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBook } from '../../domain/entities/user-book.entity';
import { UserBookRepository } from '../../repositories/user-book.repository';

@Injectable({
    providedIn: 'root'
})
export class UpdateUserBookUseCase implements UseCaseInterface {
    constructor(private userBookRepository: UserBookRepository) { }

    execute(userBook: UserBook): Observable<UserBook> {
        return this.userBookRepository.updateUserBook(userBook);
    }
}
