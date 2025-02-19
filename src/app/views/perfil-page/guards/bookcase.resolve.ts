import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { GetAllUserBookByProfileIdUseCase } from 'src/app/core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { Bookcase } from 'src/app/core/domain/entities/bookcase.entity';
import { GetUserByUsernameUseCase } from 'src/app/core/use-cases/user/get-user-by-username.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { map } from 'rxjs/operators';


@Injectable()
export class BookcaseResolve implements Resolve<{ bookcase: Bookcase, user: User }> {
    public bookcase: Bookcase;
    user: User;


    constructor(
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
        private getUserByUsernameUseCase: GetUserByUsernameUseCase,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<{ bookcase: Bookcase, user: User }> | Promise<{ bookcase: Bookcase, user: User }> | { bookcase: Bookcase, user: User } {
        const username = route.parent.params.username;
        return forkJoin([
            this.getUserByUsernameUseCase.execute(username),
            this.getAllUserBookByProfileIdUseCase.execute(),
        ]).pipe(map((value) => {
            return { bookcase: new Bookcase(undefined, undefined, value[1]), user: value[0] };
        }));
    }
}
