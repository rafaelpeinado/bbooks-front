import { UserBookApiService } from 'src/app/infrastructure/adapters/user-book.service';
import { UseCaseInterface } from '../use-case.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBook } from '../../domain/entities/user-book.entity';
import { UserBookUpdateStatusTO } from 'src/app/infrastructure/dtos/user-book.dto';

@Injectable({
    providedIn: 'root'
})
export class ChangeStatusUserBookUseCase implements UseCaseInterface {
    constructor(private userBookApiService: UserBookApiService) { }

    execute(userBookUpdateStatusTO: UserBookUpdateStatusTO): Observable<UserBook> {
        return this.userBookApiService.changeStatusUserBook(userBookUpdateStatusTO);
    }
}
