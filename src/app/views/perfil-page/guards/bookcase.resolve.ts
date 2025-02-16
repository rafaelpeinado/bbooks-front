import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { UserTO } from '../../../models/userTO.model';
import { take } from 'rxjs/operators';
import { Profile } from '../../../models/profileTO.model';
import { GetAllUserBookByProfileIdUseCase } from 'src/app/core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { Bookcase } from 'src/app/core/domain/entities/bookcase.entity';
import { GetTokenUseCase } from 'src/app/core/use-cases/auth/get-token.use-case';


@Injectable()
export class BookcaseResolve implements Resolve<any> {
    public bookcase: Bookcase;
    user = new UserTO();


    constructor(
        private userService: UserService,
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
        private getTokenUseCase: GetTokenUseCase,
    ) {
        this.bookcase.userBooks = [];
        this.user.profile = new Profile();

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const username = route.parent.params.username;
        this.bookcase.userBooks = [];
        this.userService.getUserName(username, this.getTokenUseCase.execute<string>()).pipe(take(1)).subscribe(user => {
            this.getAllUserBookByProfileIdUseCase.execute(user.profile.id.toString())
                .pipe(take(1))
                .subscribe(userBooks => {
                    this.bookcase.userBooks = userBooks;
                });
            this.user.id = user.id;
            this.user.idSocial = user.idSocial;
            this.user.email = user.email;
            this.user.verified = user.verified;
            this.user.userName = user.userName;
            this.user.token = user.token;
            this.user.profile.id = this.user.profile.id;
            this.user.profile.name = this.user.profile.name;
        });
        return {
            bookcase: this.bookcase,
            user: this.user
        };
    }
}
