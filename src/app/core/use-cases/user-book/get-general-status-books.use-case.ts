import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { ApiType } from '../../domain/enums/api-type.enum';
import { Observable } from 'rxjs';
import { GeneralStatus } from '../../domain/entities/general-status.entity';
import { UserBookRepository } from '../../repositories/user-book.repository';

@Injectable({
    providedIn: 'root'
})
export class GetGeneralStatusBooksUseCase implements UseCaseApiInterface<ApiType> {
    constructor(private readonly userBookRepository: UserBookRepository) { }

    execute(id: string, apiType: ApiType): Observable<GeneralStatus> {
        return this.userBookRepository.getGeneralStatusBooks(id, apiType);
    }
}
