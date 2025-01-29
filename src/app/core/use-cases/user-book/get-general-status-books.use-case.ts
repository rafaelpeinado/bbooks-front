import { Injectable } from "@angular/core";
import { UseCaseApiInterface } from "../use-case.interface";
import { UserBookApiService } from "src/app/infrastructure/adapters/user-book.service";
import { ApiType } from "../../domain/enums/api-type.enum";
import { Observable } from "rxjs";
import { GeneralStatus } from "../../domain/entities/general-status.entity";

@Injectable({
    providedIn: 'root'
})
export class GetGeneralStatusBooksUseCase implements UseCaseApiInterface {
    constructor(private userBookApiService: UserBookApiService) { }

    execute(id: string, apiType: ApiType): Observable<GeneralStatus> {
        return this.userBookApiService.getGeneralStatusBooks(id, apiType);
    }
}