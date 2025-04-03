import { Injectable } from '@angular/core';
import { User } from '../../domain/entities/user.entity';
import { UseCaseInterface } from '../use-case.interface';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { SetCache } from '../../domain/interfaces/set-cache.interface';
import { SetCacheUseCase } from '../cache/set-cache.use-case';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';

@Injectable({
    providedIn: 'root',
})

export class SetCacheUserUseCase implements UseCaseInterface {
    constructor(private readonly setCacheUseCase: SetCacheUseCase) { }

    execute(input: User): void {
        const setCache: SetCache<User> = { value: input, storageItem: StorageItem.USER };
        return this.setCacheUseCase.execute<User>(setCache, StorageType.LOCAL_STORAGE);
    }
}
