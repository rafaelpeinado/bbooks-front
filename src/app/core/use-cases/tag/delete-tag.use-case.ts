import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { Tag } from '../../domain/entities/tag.entity';
import { Observable } from 'rxjs';
import { TagRepository } from '../../repositories/tag.repository';

@Injectable({
    providedIn: 'root'
})
export class DeleteTagUseCase implements UseCaseInterface {
    constructor(private readonly tagRepository: TagRepository) { }

    execute(id: string): Observable<Tag> {
        return this.tagRepository.deleteTag(id);
    }
}
