import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { RemoveCacheUseCase } from "../cache/remove-cache.use-case";
import { StorageItem } from "src/app/infrastructure/enums/storage-item.enum";
import { StorageType } from "../../domain/enums/storage-type.enum";
import { RemoveCachedUserUseCase } from "../user/remove-cached-user.use-case";
import { RemoveTokenUseCase } from "./remove-token.use-case";

@Injectable({
    providedIn: 'root',
})

export class ClearCacheUseCase implements UseCaseInterface {
    constructor(
        private removeCachedUserUseCase: RemoveCachedUserUseCase,
        private removeTokenUseCase: RemoveTokenUseCase,
        private removeCacheUseCase: RemoveCacheUseCase
    ) { }

    execute(): void {
        this.removeCachedUserUseCase.execute();
        this.removeTokenUseCase.execute();
        this.removeCacheUseCase.execute(StorageItem.PROVIDER, StorageType.LOCAL_STORAGE);
    }
}