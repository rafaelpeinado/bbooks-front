import { Injectable } from "@angular/core";
import { UseCaseApiInterface } from "../use-case.interface";
import { LoginServiceFactory } from "src/app/infrastructure/adapters/factories/login-service.factory";
import { LoginType } from "../../domain/enums/login-type.enum";
import { Observable } from "rxjs";
import { GetCacheUseCase } from "../cache/get-cache.use-case";
import { StorageItem } from "src/app/infrastructure/enums/storage-item.enum";
import { StorageType } from "../../domain/enums/storage-type.enum";
import { tap } from "rxjs/operators";
import { SetIsLoggedUseCase } from "./set-is-logged.use-case";
import { ClearCacheUseCase } from "./clear-cache.use-case";

@Injectable({
    providedIn: 'root'
})
export class LogoutUseCase implements UseCaseApiInterface<LoginType> {
    constructor(
        private loginServiceFactory: LoginServiceFactory,
        private getCacheUseCase: GetCacheUseCase,
        private setIsLoggedUseCase: SetIsLoggedUseCase,
        private clearCacheUseCase: ClearCacheUseCase,
    ) { }

    execute(): Observable<void> {
        const loginType: LoginType = this.getCacheUseCase.execute<LoginType>(StorageItem.PROVIDER, StorageType.LOCAL_STORAGE);
        const service = this.loginServiceFactory.create(loginType);
        return service.logout().pipe(
            tap(() => {
                this.setIsLoggedUseCase.execute(false);
                this.clearCacheUseCase.execute();
            }),
        );
    }
}