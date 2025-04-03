import { Injectable } from '@angular/core';
import { UseCaseInterface } from '../use-case.interface';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { GetCacheUseCase } from '../cache/get-cache.use-case';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';

@Injectable({
    providedIn: 'root'
})
export class GetTokenUseCase implements UseCaseInterface {
    constructor(private readonly getCacheUseCase: GetCacheUseCase) { }

    execute(): string {
        return this.getCacheUseCase.execute<string>(StorageItem.TOKEN, StorageType.LOCAL_STORAGE);
    }
}
