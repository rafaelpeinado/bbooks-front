import { Injectable } from "@angular/core";
import { User } from "../../domain/entities/user.entity";
import { UseCaseInterface } from "../use-case.interface";
import { CacheService } from "src/app/infrastructure/adapters/cache.service";
import { StorageItem } from "src/app/infrastructure/enums/storage-item.enum";
import { StorageType } from "../../domain/enums/storage-type.enum";

@Injectable({
    providedIn: 'root',
})

export class GetCachedUserUseCase implements UseCaseInterface {
    constructor(private cacheService: CacheService) { }

    execute(): User {
        return this.cacheService.get<User>(StorageItem.USER, StorageType.LOCAL_STORAGE);
    }
}
