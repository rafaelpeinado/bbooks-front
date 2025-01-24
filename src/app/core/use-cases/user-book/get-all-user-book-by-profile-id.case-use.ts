import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { UserBookApiService } from "src/app/infrastructure/adapters/user-book.service";
import { Observable } from "rxjs";
import { UserBook } from "../../domain/entities/user-book.entity";

@Injectable({
    providedIn: 'root'
})
export class GetAllUserBookByProfileIdUseCase implements UseCaseInterface {
    constructor(private userBookApiService: UserBookApiService) { }

    execute(profileId: string): Observable<UserBook[]> {
        return this.userBookApiService.getAllUserBooksByProfileId(profileId);
    }
}