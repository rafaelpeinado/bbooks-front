import { Injectable } from "@angular/core";
import { UseCaseApiInterface } from "../use-case.interface";
import { StorageItem } from "src/app/infrastructure/enums/storage-item.enum";
import { StorageType } from "../../domain/enums/storage-type.enum";
import { CacheRepository } from "../../repositories/cache.repository";

@Injectable({
    providedIn: 'root'
})
export class RemoveCacheUseCase implements UseCaseApiInterface<StorageType> {
    constructor(private cacheRepository: CacheRepository) { }

    execute(storageItem: StorageItem, storageType: StorageType): void {
        return this.cacheRepository.remove(storageItem, storageType);
    }
}
