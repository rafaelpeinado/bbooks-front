import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { RemoveCacheUseCase } from '../cache/remove-cache.use-case';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';
import { StorageType } from '../../domain/enums/storage-type.enum';

@Injectable({
    providedIn: 'root',
})

export class RemoveCachedUserUseCase implements UseCaseInterface {
    constructor(private readonly removeCacheUseCase: RemoveCacheUseCase) { }

    execute(): void {
        this.removeCacheUseCase.execute(StorageItem.USER, StorageType.LOCAL_STORAGE);
    }
}
