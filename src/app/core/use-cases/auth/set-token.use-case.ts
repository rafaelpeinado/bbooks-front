import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { SetCacheUseCase } from '../cache/set-cache.use-case';
import { SetCache } from '../../domain/interfaces/set-cache.interface';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';

@Injectable({
    providedIn: 'root'
})
export class SetTokenUseCase implements UseCaseInterface {
    constructor(private setCacheUseCase: SetCacheUseCase) { }

    execute(input: string): void {
        const setCache: SetCache<string> = { value: input, storageItem: StorageItem.TOKEN }
        return this.setCacheUseCase.execute<string>(setCache, StorageType.LOCAL_STORAGE);
    }
}
