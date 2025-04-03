import { Injectable } from '@angular/core';
import { User } from '../../domain/entities/user.entity';
import { UseCaseInterface } from '../use-case.interface';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { GetCacheUseCase } from '../cache/get-cache.use-case';

@Injectable({
    providedIn: 'root',
})

export class GetCachedUserUseCase implements UseCaseInterface {
    constructor(private readonly getCacheUseCase: GetCacheUseCase) { }

    execute(): User {
        return this.getCacheUseCase.execute<User>(StorageItem.USER, StorageType.LOCAL_STORAGE);
    }
}
