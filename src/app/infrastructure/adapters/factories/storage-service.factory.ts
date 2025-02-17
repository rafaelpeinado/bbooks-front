import { Injectable } from '@angular/core';
import { StorageType } from '../../../core/domain/enums/storage-type.enum';
import { FactoryApi } from './factory.factory';

@Injectable({
    providedIn: 'root'
})
export class StorageServiceFactory extends FactoryApi<Storage> {

    create(storageType: StorageType): Storage {
        if (storageType === StorageType.LOCAL_STORAGE) {
            return localStorage;
        }
        return sessionStorage;
    }
}
