import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { Observable } from 'rxjs';
import { Tag } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../repositories/tag.repository';

@Injectable({
    providedIn: 'root'
})
export class EditTagUseCase implements UseCaseInterface {
    constructor(private readonly tagRepository: TagRepository) { }

    execute(tag: Tag): Observable<Tag> {
        return this.tagRepository.editTag(tag);
    }
}
