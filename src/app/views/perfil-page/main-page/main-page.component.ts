import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Util } from '../../shared/utils/util';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetUserByUsernameUseCase } from 'src/app/core/use-cases/user/get-user-by-username.use-case';
import { CreateFriendshipUseCase } from 'src/app/core/use-cases/friendship/create-friendship.use-case';
import { finalize, switchMap } from 'rxjs/operators';
import { AcceptFriendshipUseCase } from 'src/app/core/use-cases/friendship/accept-friendship.use-case';
import { DeleteFriendshipRequestUseCase } from 'src/app/core/use-cases/friendship/delete-friendship-request.use-case';
import { GetFriendshipRequestByUsernameUseCase } from 'src/app/core/use-cases/friendship/get-friendship-request-by-username.use-case';
import { DeleteFriendshipUseCase } from 'src/app/core/use-cases/friendship/delete-friendship.use-case';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnChanges {
    public user: User;
    public userCached: User;
    public friendshipStatus = null;
    links = ['bookcase', 'friends'];
    activeLink = this.links[0];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private getUserByUsernameUseCase: GetUserByUsernameUseCase,
        private sendAddFriendUseCase: CreateFriendshipUseCase,
        private acceptFriendshipUseCase: AcceptFriendshipUseCase,
        private deleteFriendshipRequestUseCase: DeleteFriendshipRequestUseCase,
        private getFriendshipRequestByUsernameUseCase: GetFriendshipRequestByUsernameUseCase,
        private deleteFriendshipUseCase: DeleteFriendshipUseCase,
    ) {
        this.route.data.subscribe((data: { user: User }) => {
            this.user = data.user;
        });
    }

    ngOnInit(): void {
        this.userCached = this.getCachedUserUseCase.execute();
        this.changeMenu();
    }

    ngOnChanges() {
        this.changeMenu();
        this.getUser();
    }

    getUser() {
        this.getUserByUsernameUseCase.execute(this.user.profile.username).subscribe((user) => this.user = user);
    }

    changeMenu(): void {
        const result = this.links.find(l => this.router.url.toLowerCase().includes(l.toLowerCase()));
        if (result) {
            this.activeLink = result;
            this.router.navigate(['/perfil', `${this.user.profile.username}/${result.toString()}`]);
        } else {
            this.activeLink = this.links[0];
            this.router.navigate(['/perfil', `${this.user.profile.username}/${this.links[0].toString()}`]);
        }
    }

    verfiyPerfilPageisUserLogged() {
        if (this.user?.id) {
            return this.userCached.id === this.user.id;
        } else {
            return false;
        }
    }

    sendRequest() {
        Util.loadingScreen();
        this.sendAddFriendUseCase.execute(this.user.profile.id)
            .pipe(
                finalize(() => Util.stopLoading()),
                switchMap(() => this.translate.get('PADRAO.SOLICITACAO_ENVIADA'))
            )
            .subscribe(
                (message) => {
                    this.friendshipStatus = 'sent';
                    Util.showSuccessDialog(message);
                },
                (error) => console.log(error),
            );
    }

    deleteRequest(username: string) {
        // TODO verificar se o status é pending
        this.getFriendshipRequestByUsernameUseCase.execute(username).pipe(
            switchMap((friendship) => this.deleteFriendshipRequestUseCase.execute(friendship.id)),
            switchMap(() => this.translate.get('PADRAO.SOLICITACAO_N_ACEITA')),
        ).subscribe(message => {
            Util.showSuccessDialog(message);
            this.getUser();
        });
    }

    aceptRequest(username: string) {
        // TODO verificar se o status é pending
        this.getFriendshipRequestByUsernameUseCase.execute(username).pipe(
            switchMap((friendship) => this.acceptFriendshipUseCase.execute(friendship.id)),
            switchMap(() => this.translate.get('PADRAO.SOLICITACAO_ACEITA')),
        ).subscribe(message => {
            Util.showSuccessDialog(message);
            this.getUser();
        });
    }

    deleteFriend(idProfile: string) {
        this.deleteFriendshipUseCase.execute(idProfile).subscribe(() => {
            this.getUser();
        }, error => {
            console.log(error);
        });
    }

}
