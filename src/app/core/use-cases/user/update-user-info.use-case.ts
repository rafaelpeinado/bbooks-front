import { UserService } from 'src/app/infrastructure/adapters/user.service';
import { UseCaseInterface } from '../use-case.interface';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SetCacheUseCase } from '../cache/set-cache.use-case';
import { SetCache } from '../../domain/interfaces/set-cache.interface';
import { User } from '../../domain/entities/user.entity';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class UpdateUserInfoUseCase implements UseCaseInterface {
    constructor(
        private userService: UserService,
        private setCacheUseCase: SetCacheUseCase,
    ) { }

    execute(): Observable<User> {
        return this.userService.updateUserInfo().pipe(
            map((user) => {
                const setCache: SetCache<User> = { value: user, storageItem: StorageItem.USER };
                this.setCacheUseCase.execute<User>(setCache, StorageType.LOCAL_STORAGE);
                return user;
            })
        );
    }
}
