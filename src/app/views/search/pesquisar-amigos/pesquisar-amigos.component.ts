import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetUsersByNameUseCase } from 'src/app/core/use-cases/user/get-users-by-name.use-case';
import { GetUsersByUsernameUseCase } from 'src/app/core/use-cases/user/get-users-by-username.use-case';

@Component({
    selector: 'app-pesquisar-amigos',
    templateUrl: './pesquisar-amigos.component.html',
    styleUrls: ['./pesquisar-amigos.component.scss']
})
export class PesquisarAmigosComponent implements OnInit {

    public filterUsers: User[] = [];

    constructor(
        private route: ActivatedRoute,
        private getUsersByNameUseCase: GetUsersByNameUseCase,
        private getUsersByUsernameUseCase: GetUsersByUsernameUseCase,
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.pipe(
            switchMap(({ search }) => {
                if (!search) return of([]);
                return combineLatest([
                    this.getUsersByNameUseCase.execute(search),
                    this.getUsersByUsernameUseCase.execute(search),
                ]).pipe(
                    map(([usersByName, usersByUsername]) => this.mergeUniqueUsers(usersByName, usersByUsername))
                );
            }),
        ).subscribe((users) => this.filterUsers = users);
    }

    private mergeUniqueUsers(users1: User[], users2: User[]): User[] {
        const userMap = new Map<string, User>();
        [...users1, ...users2].forEach(user => userMap.set(user.id, user));
        return Array.from(userMap.values());
    }
}
