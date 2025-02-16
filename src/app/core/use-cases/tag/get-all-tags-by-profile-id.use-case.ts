import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { TagApiService } from 'src/app/infrastructure/adapters/tag.service';
import { Observable } from 'rxjs';
import { Tag } from '../../domain/entities/tag.entity';
import { User } from '../../domain/entities/user.entity';
import { GetCachedUserUseCase } from '../user/get-cached-user.use-case';

@Injectable({
    providedIn: 'root'
})
export class GetAllTagsByProfileIdTagUseCase implements UseCaseInterface {
    constructor(
        private tagApiService: TagApiService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) { }

    execute(): Observable<Tag[]> {
        const user: User = this.getCachedUserUseCase.execute();
        return this.tagApiService.getAllTagsByProfileId(user.profile.id);
    }
}
