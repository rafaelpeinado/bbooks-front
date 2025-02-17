import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { catchError, map } from 'rxjs/operators';
import { GetTokenUseCase } from 'src/app/core/use-cases/auth/get-token.use-case';

@Injectable({
    providedIn: 'root'
})
export class MainGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService,
        private getTokenUseCase: GetTokenUseCase,

    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        const username = route.params.username;
        return this.userService.getUserName(username, this.getTokenUseCase.execute()).pipe(
            map((res) => {
                if (res?.userName.includes(username)) {
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
