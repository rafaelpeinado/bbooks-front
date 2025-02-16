import { Injectable } from '@angular/core';
import { StorageType } from '../../../core/domain/enums/storage-type.enum';

@Injectable({
    providedIn: 'root'
})
export class StorageServiceFactory {
    public getStorage(storageType: StorageType): Storage {
        if (storageType === StorageType.LOCAL_STORAGE) {
            return localStorage;
        }
        return sessionStorage;
    }
}
