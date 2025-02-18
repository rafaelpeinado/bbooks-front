import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendsService } from '../../../services/friends.service';
import { Friend } from '../../../models/friend.model';
import { TranslateService } from '@ngx-translate/core';
import { Util } from '../../shared/Utils/util';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetUserByUsernameUseCase } from 'src/app/core/use-cases/user/get-user-by-username.use-case';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnChanges {
    public user: User;
    public userCached: User;
    public friendshipStatus: string = '';
    links = ['feed', 'bookcase', 'friends'];
    activeLink = this.links[0];
    friendTO: Friend = new Friend();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private friendsService: FriendsService,
        public translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private getUserByUsernameUseCase: GetUserByUsernameUseCase,
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
            this.router.navigate([`${this.user.profile.username}/${result.toString()}`]);
        } else {
            this.activeLink = this.links[0];
            this.router.navigate([`${this.user.profile.username}/${this.links[0].toString()}`]);
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
        this.friendTO = new Friend();
        this.friendTO.id = +this.user.profile.id;
        this.friendsService.add(this.friendTO).subscribe(() => {
            this.translate.get('PADRAO.SOLICITACAO_ENVIADA').subscribe(message => {
                Util.showSuccessDialog(message);
            });
            this.friendshipStatus = 'sent';
        },
            error => {
                console.log(error);
            });
    }

    deleteRequest(username: string) {
        this.friendsService.getRequestByUserName(username).subscribe(request => {
            const acept = new Friend();
            acept.id = request.id;
            this.friendsService.deleteRequest(acept).subscribe(() => {
                this.translate.get('PADRAO.SOLICITACAO_N_ACEITA').subscribe(message => {
                    Util.showSuccessDialog(message);
                    this.getUser();
                });
            });
        });
    }

    aceptRequest(username: string) {
        this.friendsService.getRequestByUserName(username).subscribe(request => {
            const acept = new Friend();
            acept.id = request.id;
            this.friendsService.acceptRequest(acept).subscribe(() => {
                this.translate.get('PADRAO.SOLICITACAO_ACEITA').subscribe(message => {
                    Util.showSuccessDialog(message);
                    this.getUser();
                });
            });
        });
    }

    deleteFriend(idProfile: string) {
        this.friendsService.deleteFriend(+idProfile).subscribe(() => {
            this.getUser();
        },
            error => {
                console.log(error);
            });
    }

}
