import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { SetCache } from '../../domain/interfaces/set-cache.interface';
import { CacheRepository } from '../../repositories/cache.repository';

@Injectable({
    providedIn: 'root'
})
export class SetCacheUseCase implements UseCaseApiInterface<StorageType> {
    constructor(private cacheRepository: CacheRepository) { }

    execute<T>(setCache: SetCache<T>, storageType: StorageType): void {
        return this.cacheRepository.set<T>(setCache, storageType);
    }
}
