import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { Observable } from "rxjs";
import { Tag } from "../../domain/entities/tag.entity";
import { TagApiService } from "src/app/infrastructure/adapters/tag.service";

@Injectable({
    providedIn: 'root'
})
export class GetAllTagsByUserBookIdUseCase implements UseCaseInterface {
    constructor(private tagApiService: TagApiService) { }

    execute(bookUserId: string): Observable<Tag[]> {
        return this.tagApiService.getAllTagsByUserBookId(bookUserId);
    }
}