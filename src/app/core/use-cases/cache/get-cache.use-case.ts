import { Injectable } from "@angular/core";
import { UseCaseApiInterface } from "../use-case.interface";
import { StorageItem } from "src/app/infrastructure/enums/storage-item.enum";
import { StorageType } from "../../domain/enums/storage-type.enum";
import { CacheService } from "src/app/infrastructure/adapters/cache.service";

@Injectable({
    providedIn: 'root'
})
export class GetCacheUseCase implements UseCaseApiInterface<StorageType> {
    constructor(private cacheService: CacheService) { }

    execute<T>(storageItem: StorageItem, storageType: StorageType): T {
        return this.cacheService.get<T>(storageItem, storageType);
    }
}
