import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetUserByUsernameUseCase } from 'src/app/core/use-cases/user/get-user-by-username.use-case';

@Injectable({
    providedIn: 'root'
})
export class MainGuard implements CanActivate {
    constructor(
        private router: Router,
        private getUserByUsernameUseCase: GetUserByUsernameUseCase,

    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        const username: string = (route.params.username as string).split('/')[0];
        return this.getUserByUsernameUseCase.execute(username).pipe(
            map((res) => {
                if (res?.profile?.username.includes(username)) {
                    return true;
                }
                this.router.navigate(['/']);
                return false;
            }),
            catchError(() => {
                this.router.navigate(['/pagenotfound']);
                return of(false);
            })
        );
    }
}
