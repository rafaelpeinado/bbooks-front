import { StorageItem } from "src/app/infrastructure/enums/storage-item.enum";

export interface SetCache<T> {
    value: T
    storageItem: StorageItem,
}