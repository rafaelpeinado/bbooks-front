import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { UserTO } from '../../../models/userTO.model';
import { map } from 'rxjs/operators';
import { GetTokenUseCase } from 'src/app/core/use-cases/auth/get-token.use-case';


@Injectable()
export class MainResolve implements Resolve<UserTO> {

    isUser: boolean;

    constructor(
        private userService: UserService,
        private getTokenUseCase: GetTokenUseCase,
    ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const username = route.params.username;
        let result;
        result = this.userService.getUserName(username, this.getTokenUseCase.execute())
            .pipe(
                map(user => user)
            );
        return result;
    }

}
