import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { UserBookRepository } from 'src/app/core/repositories/user-book.repository';
import { environment } from 'src/environments/environment';
import { AllUserBookByProfileIdTO, UserBookTO, UserBookUpdateStatusTO } from '../dtos/user-book.dto';
import { first, map } from 'rxjs/operators';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { GeneralStatus } from 'src/app/core/domain/entities/general-status.entity';
import { GeneralStatusTO } from '../dtos/general-status.dto';
import { UserBookMapper } from '../mappers/user-book.mapper';
import { BaseApiService } from './base-service.service';
import { mapBookStatus } from 'src/app/core/domain/enums/book-status.enum';

@Injectable({
    providedIn: 'root'
})
export class UserBookApiService extends BaseApiService<UserBook, UserBookTO> implements UserBookRepository {

    private readonly api: string = environment.api + 'bookcases/';
    private readonly apiProfile: string = this.api + 'profile/';
    private readonly apiStatusData: string = this.api + 'status-data';

    constructor(protected readonly http: HttpClient) {
        super(http);
    }

    changeStatusUserBook(userBook: Partial<UserBook>): Observable<UserBook> {
        const userBookUpdateStatusTO: UserBookUpdateStatusTO = { id: userBook.id, status: mapBookStatus.get(userBook.status) };
        const service = this.http.put<UserBookTO>(this.api + 'status', userBookUpdateStatusTO);
        return this.handleRequestDTOToEntity(service, UserBookMapper.toEntity);
    }

    getAllUserBookTimelineByProfileId(profileId: string): Observable<UserBook[]> {
        const params = new HttpParams()
            .set('timeLine', 'true');
        return this.http.get<AllUserBookByProfileIdTO>(this.api + 'profile/' + profileId, { params }).pipe(
            first(),
            map((response) => response.books.map((userBookTO) => UserBookMapper.toEntity(userBookTO)))
        );
    }

    getGeneralStatusBooks(id: string, apiType: ApiType): Observable<GeneralStatus> {
        const params = new HttpParams();
        params.append(this.getParamGeneralStatus(apiType), id);

        return this.http.get<GeneralStatusTO>(this.apiStatusData, { params }).pipe(
            first(),
            map((generalStatusTO) => this.convertGeneralStatusTOToGeneralStatusEntity(generalStatusTO, apiType))
        );
    }

    updateUserBook(userBook: UserBook): Observable<UserBook> {
        const userBookTO: UserBookTO = UserBookMapper.toDTO(userBook);
        const service = this.http.put<UserBookTO>(this.api + userBookTO.id, userBookTO);
        return this.handleRequestDTOToEntity(service, UserBookMapper.toEntity);
    }

    createUserBook(userBook: UserBook): Observable<UserBook> {
        const userBookTO: UserBookTO = UserBookMapper.toDTO(userBook);
        const service = this.http.post<UserBookTO>(this.api, userBookTO);
        return this.handleRequestDTOToEntity(service, UserBookMapper.toEntity);
    }

    getAllUserBooksByProfileId(profileId: string): Observable<UserBook[]> {
        return this.http.get<AllUserBookByProfileIdTO>(this.apiProfile + profileId).pipe(
            first(),
            map((response) => response.books.map((userBookTO) => UserBookMapper.toEntity(userBookTO)))
        );
    }

    getUserBookById(id: string): Observable<UserBook> {
        const service = this.http.get<UserBookTO>(this.api + id);
        return this.handleRequestDTOToEntity(service, UserBookMapper.toEntity);
    }

    private getParamGeneralStatus(apiType: ApiType): string {
        if (apiType === ApiType.GOOGLE) {
            return 'googleBook';
        }
        return 'bookId';
    }

    private convertGeneralStatusTOToGeneralStatusEntity(generalStatusTO: GeneralStatusTO, apiType: ApiType): GeneralStatus {
        return new GeneralStatus(
            generalStatusTO.queroLer,
            generalStatusTO.lendo,
            generalStatusTO.lido,
            generalStatusTO.emprestado,
            generalStatusTO.relendo,
            generalStatusTO.interrompido
        );
    }
}
