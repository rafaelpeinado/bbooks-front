import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserBook } from "src/app/core/domain/entities/user-book.entity";
import { UserBookRepository } from "src/app/core/repositories/user-book.repository";
import { environment } from "src/environments/environment";
import { AllUserBookByProfileIdTO, UserBookTO } from "../dtos/user-book.dto";
import { map } from "rxjs/operators";
import { UserBookBuilder } from "src/app/core/domain/builders/user-book.builder";
import { BookBuilder } from "src/app/core/domain/builders/book.builder";
import { ApiType } from "src/app/core/domain/enums/api-type.enum";

@Injectable({
    providedIn: 'root'
})

export class UserBookApiService implements UserBookRepository {

    private api: string = environment.api + 'bookcases/';
    private apiProfile: string = this.api + 'profile/';

    constructor(private http: HttpClient) { }

    getAllUserBooksByProfileId(profileId: string): Observable<UserBook[]> {
        return this.http.get<AllUserBookByProfileIdTO>(this.apiProfile + profileId).pipe(
            map((response) => response.books.map((userBookTO) => new UserBookBuilder()
                .setId(userBookTO.id)
                .setProfileId(userBookTO.profileId)
                .setBook(
                    new BookBuilder()
                        .setId(userBookTO.idBookGoogle ? userBookTO.idBookGoogle : userBookTO.idBook)
                        .setApi(userBookTO.idBookGoogle ? ApiType.GOOGLE : ApiType.BBOOKS)
                        .setNumberPage(userBookTO.page)
                        .setTags(userBookTO.tags)
                        .setStatus(userBookTO.status)
                        .setFinishDate(userBookTO.finishDate)
                        .build()
                )
                .setAddDate(userBookTO.addDate)
                .setFinishDate(userBookTO.finishDate)
                .build()
            ))
        );
    }

    getUserBookById(id: string): Observable<UserBook> {
        return this.http.get<UserBookTO>(this.api + id).pipe(
            map((response) => new UserBookBuilder()
                .setId(response.id)
                .setBook(
                    new BookBuilder().copyFrom(response.book)
                        .setId(response.idBookGoogle ? response.idBookGoogle : response.idBook)
                        .setApi(response.idBookGoogle ? ApiType.GOOGLE : ApiType.BBOOKS)
                        .setNumberPage(response.page)
                        .setTags(response.tags)
                        .setStatus(response.status)
                        .build()
                )
                .setStatus(response.status)
                .setProfileId(response.profileId)
                .setAddDate(response.addDate)
                .setFinishDate(response.finishDate)
                .build()
            ));
    }

}