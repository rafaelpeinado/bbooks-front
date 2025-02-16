import { UserBookApiService } from 'src/app/infrastructure/adapters/user-book.service';
import { UseCaseInterface } from '../use-case.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBook } from '../../domain/entities/user-book.entity';

@Injectable({
    providedIn: 'root'
})
export class CreateUserBookUseCase implements UseCaseInterface {
    constructor(private userBookApiService: UserBookApiService) { }

    execute(userBook: UserBook): Observable<UserBook> {
        return this.userBookApiService.createUserBook(userBook);
    }
}
