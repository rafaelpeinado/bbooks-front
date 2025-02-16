import { Injectable } from '@angular/core';
import { UseCaseApiInterface } from '../use-case.interface';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { CacheService } from 'src/app/infrastructure/adapters/cache.service';
import { SetCache } from '../../domain/interfaces/set-cache.interface';

@Injectable({
    providedIn: 'root'
})
export class SetCacheUseCase implements UseCaseApiInterface<StorageType> {
    constructor(private cacheService: CacheService) { }

    execute<T>(setCache: SetCache<T>, storageType: StorageType): void {
        return this.cacheService.set<T>(setCache, storageType);
    }
}
