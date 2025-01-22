import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { UserTO } from '../../../models/userTO.model';
import { take } from 'rxjs/operators';
import { BookCase } from '../../../models/bookCase.model';
import { UserbookService } from '../../../services/userbook.service';
import { Profile } from '../../../models/profileTO.model';
import { AuthService } from '../../../services/auth.service';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';


@Injectable()
export class BookcaseResolve implements Resolve<any> {
    bookCase: BookCase = new BookCase();
    user = new UserTO();


    constructor(
        private userService: UserService,
        private userBookService: UserbookService,
        private authservice: AuthService,
        private getBookByIdUseCase: GetBookByIdUseCase,
    ) {
        this.bookCase.books = [];
        this.user.profile = new Profile();

    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const username = route.parent.params.username;
        this.bookCase.books = [];
        this.userService.getUserName(username, this.authservice.getToken()).pipe(take(1)).subscribe(user => {
            this.userBookService.getAllByProfile(user.profile.id)
                .pipe(take(1))
                .subscribe(userBook => {
                    userBook.books.forEach(realation => {
                        let apiType: ApiType;
                        let id;

                        if (realation.idBookGoogle) {
                            id = realation.idBookGoogle;
                            apiType = ApiType.GOOGLE;
                        } else {
                            id = realation.idBook ? realation.idBook : realation.book.id;
                            apiType = ApiType.BBOOKS;
                        }

                        this.getBookByIdUseCase.execute(id, apiType).subscribe((book) => {
                            const bookBuilder = new BookBuilder().copyFrom(book)
                                .setIdUserBook(realation.id)
                                .setStatus(realation.status)
                                .setFinishDate(realation.finishDate)
                                .build();
                            this.bookCase.books.push(bookBuilder);
                        });
                    });
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
            bookcase: this.bookCase,
            user: this.user
        };
    }
}
