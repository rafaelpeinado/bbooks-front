import { Injectable } from "@angular/core";
import { UseCaseApiInterface } from "../use-case.interface";
import { StorageItem } from "src/app/infrastructure/enums/storage-item.enum";
import { StorageType } from "../../domain/enums/storage-type.enum";
import { CacheService } from "src/app/infrastructure/adapters/cache.service";

@Injectable({
    providedIn: 'root'
})
export class RemoveCacheUseCase implements UseCaseApiInterface<StorageType> {
    constructor(private cacheService: CacheService) { }

    execute(storageItem: StorageItem, storageType: StorageType): void {
        return this.cacheService.remove(storageItem, storageType);
    }
}
