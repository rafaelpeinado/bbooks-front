import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { Tag } from '../../domain/entities/tag.entity';
import { Observable } from 'rxjs';
import { TagApiService } from 'src/app/infrastructure/adapters/tag.service';

@Injectable({
    providedIn: 'root'
})
export class CreateTagUseCase implements UseCaseInterface {
    constructor(private tagApiService: TagApiService) { }

    execute(tag: Tag): Observable<Tag> {
        return this.tagApiService.addTag(tag);
    }
}
