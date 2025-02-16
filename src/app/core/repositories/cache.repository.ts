import { StorageItem } from "src/app/infrastructure/enums/storage-item.enum";
import { StorageType } from "../domain/enums/storage-type.enum";
import { SetCache } from "../domain/interfaces/set-cache.interface";

export abstract class CacheRepository {
    abstract get<T>(storageItem: StorageItem, storageType: StorageType): T;
    abstract set<T>(setCache: SetCache<T>, storageType: StorageType): void;
    abstract remove(storageItem: StorageItem, storageType: StorageType): void;
}
