import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GetIsLoggedUseCase } from '../core/use-cases/auth/get-is-logged.use-case';
import { map } from 'rxjs/operators';
import { LogoutUseCase } from '../core/use-cases/auth/logout.use-case';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private getIsLoggedUseCase: GetIsLoggedUseCase,
        private logoutUseCase: LogoutUseCase,
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        return this.getIsLoggedUseCase.execute().pipe(
            map((isLogged) => {
                if (!isLogged) {
                    this.logoutUseCase.execute().subscribe(() => {
                    this.router.navigate(['']);
                    return !isLogged;
                });
                }
                return isLogged;

            })
        );
    }
}
