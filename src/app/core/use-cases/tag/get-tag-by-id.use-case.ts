import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { TagApiService } from 'src/app/infrastructure/adapters/tag.service';
import { Tag } from '../../domain/entities/tag.entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GetTagByIdUseCase implements UseCaseInterface {
    constructor(private tagApiService: TagApiService) { }

    execute(id: string): Observable<Tag> {
        return this.tagApiService.getTagById(id);
    }
}
