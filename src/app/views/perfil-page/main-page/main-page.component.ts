import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTO } from '../../../models/userTO.model';
import { FriendsService } from '../../../services/friends.service';
import { Friend } from '../../../models/friend.model';
import { TranslateService } from '@ngx-translate/core';
import { Util } from '../../shared/Utils/util';
import { GetTokenUseCase } from 'src/app/core/use-cases/auth/get-token.use-case';
import { UserService } from 'src/app/services/user.service';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnChanges {
    public user: User;
    links = ['feed', 'bookcase', 'friends'];
    activeLink = this.links[0];
    userTO: UserTO = new UserTO();
    friendTO: Friend = new Friend();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private friendsService: FriendsService,
        private userService: UserService,
        private getTokenUseCase: GetTokenUseCase,
        public translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
        this.route.data.subscribe((data: { user: UserTO }) => {
            this.userTO = data.user;
        });
    }

    ngOnInit(): void {
        this.user = this.getCachedUserUseCase.execute();
        this.changeMenu();
    }

    ngOnChanges() {
        this.changeMenu();
        this.getUser();
    }

    getUser() {
        this.userService.getUserName(this.userTO.userName, this.getTokenUseCase.execute<string>()).subscribe((result) => {
            this.userTO = result;
        });
    }

    changeMenu(): void {
        const result = this.links.find(l => this.router.url.toLowerCase().includes(l.toLowerCase()));
        if (result) {
            this.activeLink = result;
            this.router.navigate([`${this.userTO.userName}/${result.toString()}`]);
        } else {
            this.activeLink = this.links[0];
            this.router.navigate([`${this.userTO.userName}/${this.links[0].toString()}`]);
        }
    }

    verfiyPerfilPageisUserLogged() {
        if (this.user?.id) {
            return this.user.id === this.userTO.id;
        } else {
            return false;
        }
    }

    sendRequest() {
        this.friendTO = new Friend();
        this.friendTO.id = this.userTO.profile.id;
        this.friendsService.add(this.friendTO).subscribe(() => {
            this.translate.get('PADRAO.SOLICITACAO_ENVIADA').subscribe(message => {
                Util.showSuccessDialog(message);
            });
            this.userTO.profile.friendshipStatus = 'sent';
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

    deleteFriend(idProfile: number) {
        this.friendsService.deleteFriend(idProfile).subscribe(() => {
            this.getUser();
        },
            error => {
                console.log(error);
            });
    }

}
