import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { TagApiService } from 'src/app/infrastructure/adapters/tag.service';
import { Observable } from 'rxjs';
import { Tag } from '../../domain/entities/tag.entity';

@Injectable({
    providedIn: 'root'
})
export class GetAllTagsByProfileIdTagUseCase implements UseCaseInterface {
    constructor(private tagApiService: TagApiService) { }

    execute(id: string): Observable<Tag[]> {
        return this.tagApiService.getAllTagsByProfileId(id);
    }
}
