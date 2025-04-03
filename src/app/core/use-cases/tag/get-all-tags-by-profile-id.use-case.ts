import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { Observable } from 'rxjs';
import { Tag } from '../../domain/entities/tag.entity';
import { User } from '../../domain/entities/user.entity';
import { GetCachedUserUseCase } from '../user/get-cached-user.use-case';
import { TagRepository } from '../../repositories/tag.repository';

@Injectable({
    providedIn: 'root'
})
export class GetAllTagsByProfileIdTagUseCase implements UseCaseInterface {
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly getCachedUserUseCase: GetCachedUserUseCase,
    ) { }

    execute(): Observable<Tag[]> {
        const user: User = this.getCachedUserUseCase.execute();
        return this.tagRepository.getAllTagsByProfileId(user.profile.id);
    }
}
