import { CacheRepository } from 'src/app/core/repositories/cache.repository';
import { StorageItem } from '../enums/storage-item.enum';
import { StorageServiceFactory } from './factories/storage-service.factory';
import { StorageType } from 'src/app/core/domain/enums/storage-type.enum';
import { SetCache } from 'src/app/core/domain/interfaces/set-cache.interface';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacheService implements CacheRepository {

    constructor(private storageServiceFactory: StorageServiceFactory) { }

    get<T>(storageItem: StorageItem, storageType: StorageType): T | null {
        const storageRepository = this.storageServiceFactory.create(storageType);
        const item = storageRepository.getItem(storageItem);
        if (!item) {
            return null;
        }
        try {
            return JSON.parse(item);
        } catch (error) {
            console.error(`Erro ao fazer JSON.parse() do item '${storageItem}':`, error);
            return null;
        }

    }

    set<T>(setCache: SetCache<T>, storageType: StorageType): void {
        const storageRepository = this.storageServiceFactory.create(storageType);
        storageRepository.setItem(setCache.storageItem, JSON.stringify(setCache.value));
    }

    remove(storageItem: StorageItem, storageType: StorageType): void {
        const storageRepository = this.storageServiceFactory.create(storageType);
        storageRepository.removeItem(storageItem);
    }
}
