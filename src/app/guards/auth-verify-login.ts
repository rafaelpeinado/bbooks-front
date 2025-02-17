import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GetIsLoggedUseCase } from '../core/use-cases/auth/get-is-logged.use-case';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthVerifyLogin implements CanActivate {
    constructor(
        private router: Router,
        private getIsLoggedUseCase: GetIsLoggedUseCase,
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        return this.getIsLoggedUseCase.execute().pipe(
            map((isLogged) => {
                if (!isLogged) {
                    return true;
                }
                this.router.navigate(['']);
                return false;
            })
        );
    }
}
