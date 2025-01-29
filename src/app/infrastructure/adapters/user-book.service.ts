import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserBook } from "src/app/core/domain/entities/user-book.entity";
import { UserBookRepository } from "src/app/core/repositories/user-book.repository";
import { environment } from "src/environments/environment";
import { AllUserBookByProfileIdTO, UserBookTO } from "../dtos/user-book.dto";
import { first, map } from "rxjs/operators";
import { UserBookBuilder } from "src/app/core/domain/builders/user-book.builder";
import { BookBuilder } from "src/app/core/domain/builders/book.builder";
import { ApiType } from "src/app/core/domain/enums/api-type.enum";
import { GeneralStatus } from "src/app/core/domain/entities/general-status.entity";
import { GeneralStatusTO } from "../dtos/general-status.dto";

@Injectable({
    providedIn: 'root'
})

export class UserBookApiService implements UserBookRepository {

    private api: string = environment.api + 'bookcases/';
    private apiProfile: string = this.api + 'profile/';
    private apiStatusData: string = this.api + 'status-data';

    constructor(private http: HttpClient) { }


    getGeneralStatusBooks(id: string, apiType: ApiType): Observable<GeneralStatus> {
        const params = new HttpParams();
        params.append(this.getParamGeneralStatus(apiType), id);

        return this.http.get<GeneralStatusTO>(this.apiStatusData, { params }).pipe(
            first(),
            map((generalStatusTO) => this.convertGeneralStatusTOToGeneralStatusEntity(generalStatusTO, apiType))
        );
    }

    updateUserBook(userBook: UserBook): Observable<UserBook> {
        const userBookTO: UserBookTO = this.convertUserBookToUserBookTO(userBook);
        return this.http.put<UserBookTO>(this.api + userBookTO.id, userBookTO).pipe(
            first(),
            map((userBookTO) => this.convertUserBookTOToUserBook(userBookTO)),
        );
    }

    createUserBook(userBook: UserBook): Observable<UserBook> {
        const userBookTO: UserBookTO = this.convertUserBookToUserBookTO(userBook);
        return this.http.post<UserBookTO>(this.api, userBookTO).pipe(
            first(),
            map((userBookTO) => this.convertUserBookTOToUserBook(userBookTO)),
        );
    }

    getAllUserBooksByProfileId(profileId: string): Observable<UserBook[]> {
        return this.http.get<AllUserBookByProfileIdTO>(this.apiProfile + profileId).pipe(
            first(),
            map((response) => response.books.map((userBookTO) => this.convertUserBookTOToUserBook(userBookTO)))
        );
    }

    getUserBookById(id: string): Observable<UserBook> {
        return this.http.get<UserBookTO>(this.api + id).pipe(
            first(),
            map((response) => this.convertUserBookTOToUserBook(response)),
        );
    }

    private convertUserBookToUserBookTO(userBook: UserBook): UserBookTO {
        const userBookTO: UserBookTO = {
            profileId: userBook.profileId,
            status: userBook.status,
            tags: userBook.tags,
            page: userBook.page,
            idBookGoogle: userBook.book.api === ApiType.GOOGLE ? userBook.book.id : null,
            idBook: userBook.book.api !== ApiType.GOOGLE ? userBook.book.id : null,
            addDate: null,
            book: null,
            finishDate: null,
            id: null
        }
        return userBookTO;
    }

    private convertUserBookTOToUserBook(userBookTO: UserBookTO): UserBook {
        return new UserBookBuilder()
            .setId(userBookTO.id)
            .setBook(
                new BookBuilder().copyFrom(userBookTO.book)
                    .setId(userBookTO.idBookGoogle ? userBookTO.idBookGoogle : userBookTO.idBook)
                    .setApi(userBookTO.idBookGoogle ? ApiType.GOOGLE : ApiType.BBOOKS)
                    .setNumberPage(userBookTO.page)
                    .build()
            )
            .setStatus(userBookTO.status)
            .setTags(userBookTO.tags)
            .setProfileId(userBookTO.profileId)
            .setAddDate(userBookTO.addDate)
            .setPage(userBookTO.page)
            .setFinishDate(userBookTO.finishDate)
            .build()
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