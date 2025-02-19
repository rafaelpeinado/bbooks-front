import { Injectable } from '@angular/core';
import { StorageItem } from 'src/app/infrastructure/enums/storage-item.enum';
import { StorageType } from '../../domain/enums/storage-type.enum';
import { SetCacheUserUseCase } from '../user/set-cache-user.use-case';
import { SetTokenUseCase } from './set-token.use-case';
import { SetCacheUseCase } from '../cache/set-cache.use-case';
import { SetCache } from '../../domain/interfaces/set-cache.interface';
import { User } from '../../domain/entities/user.entity';
import { UseCaseApiInterface } from '../use-case.interface';
import { LoginType } from '../../domain/enums/login-type.enum';

@Injectable({
    providedIn: 'root',
})

export class CreateLoginCacheUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private setCacheUserUseCase: SetCacheUserUseCase,
        private setTokenUseCase: SetTokenUseCase,
        private setCacheUseCase: SetCacheUseCase,
    ) { }

    execute(user: User, loginType: LoginType): void {
        const setCacheProvider: SetCache<string> = { value: loginType, storageItem: StorageItem.PROVIDER };
        this.setCacheUserUseCase.execute(user);
        this.setTokenUseCase.execute(user.token);
        this.setCacheUseCase.execute(setCacheProvider, StorageType.LOCAL_STORAGE);
    }
}
