import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetUserByUsernameUseCase } from 'src/app/core/use-cases/user/get-user-by-username.use-case';


@Injectable()
export class FeedResolve implements Resolve<User> {

    constructor(
        private getUserByUsernameUseCase: GetUserByUsernameUseCase,

    ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return this.getUserByUsernameUseCase.execute(route.parent.params.username);
    }
}
