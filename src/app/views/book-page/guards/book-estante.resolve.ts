import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Book } from '../../../models/book.model';
import { Observable } from 'rxjs';
import { SearchBookByNameUseCase } from 'src/app/core/use-cases/book/search-book-by-name.use-case';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Bookcase } from 'src/app/core/domain/entities/bookcase.entity';
import { GetBookcaseByProfileIdUseCase } from 'src/app/core/use-cases/bookcase/get-bookcase-by-profile-id.use-case';
import { GetBookcaseByTagIdUseCase } from 'src/app/core/use-cases/bookcase/get-bookcase-by-tag.use-case';


@Injectable()
export class BookEstanteResolve implements Resolve<Book[]> {

    constructor(
        private searchBookByNameUseCase: SearchBookByNameUseCase,
        private authGuard: AuthService,
        private getBookcaseByProfileIdUseCase: GetBookcaseByProfileIdUseCase,
        private getBookcaseByTagIdUseCase: GetBookcaseByTagIdUseCase,
    ) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const myBook = route.url.toString().includes('my');
        const tag = route.params.tag;
        if (myBook) {
            if (tag) {
                // TODO NÃO ESTÁ FUNCIONANDO
                return this.getBookcaseByTagIdUseCase.execute(tag);
            } else {
                return this.getBookcaseByProfileIdUseCase.execute(this.authGuard.getUser().profile.id);
            }
        }
        return this.searchBookByNameUseCase.execute(tag).pipe(map((books) => new Bookcase(tag, tag, books)));
    }
}
