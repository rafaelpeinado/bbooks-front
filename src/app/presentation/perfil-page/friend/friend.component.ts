import { Component, OnInit } from '@angular/core';
import { finalize, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Util } from '../../../views/shared/utils/util';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetUserByUsernameUseCase } from 'src/app/core/use-cases/user/get-user-by-username.use-case';
import { CreateFriendshipUseCase } from 'src/app/core/use-cases/friendship/create-friendship.use-case';
import { GetFriendshipsByUsernameUseCase } from 'src/app/core/use-cases/friendship/get-friendships-by-username.use-case';
import { Friendship } from 'src/app/core/domain/entities/friendship.entity';
import { FriendshipTO } from 'src/app/infrastructure/dtos/friendship.dto';
import { GetProfileByIdUseCase } from 'src/app/core/use-cases/profile/get-profile-by-id.use-case';
import { forkJoin } from 'rxjs';
import { FriendshipStatusEnum } from 'src/app/core/domain/enums/friendship-status.enum';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';
import { DeleteFriendshipRequestUseCase } from 'src/app/core/use-cases/friendship/delete-friendship-request.use-case';
import { AcceptFriendshipUseCase } from 'src/app/core/use-cases/friendship/accept-friendship.use-case';
import { GetFriendshipRequestByUsernameUseCase } from 'src/app/core/use-cases/friendship/get-friendship-request-by-username.use-case';
import { DeleteFriendshipUseCase } from 'src/app/core/use-cases/friendship/delete-friendship.use-case';

@Component({
    selector: 'app-friend',
    templateUrl: './friend.component.html',
    styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
    public userCached: User;
    public user: User;
    public friendshipStatus = '';
    search: string;
    public formSearch: FormGroup;
    public friendships: Friendship[] = [];
    public friendshipTO: FriendshipTO[] = [];
    public filteredFriendshipTO: FriendshipTO[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private getUserByUsernameUseCase: GetUserByUsernameUseCase,
        private sendAddFriendUseCase: CreateFriendshipUseCase,
        private getFriendshipsByUsernameUseCase: GetFriendshipsByUsernameUseCase,
        private getProfileByIdUseCase: GetProfileByIdUseCase,
        private acceptFriendshipUseCase: AcceptFriendshipUseCase,
        private deleteFriendshipRequestUseCase: DeleteFriendshipRequestUseCase,
        private getFriendshipRequestByUsernameUseCase: GetFriendshipRequestByUsernameUseCase,
        private deleteFriendshipUseCase: DeleteFriendshipUseCase,
    ) {
        this.formSearch = this.formBuilder.group({
            search: new FormControl(null)
        });
        this.route.data.pipe(take(1)).subscribe((data: { user: User }) => {
            this.user = data.user;
        });
    }


    ngOnInit(): void {
        this.userCached = this.getCachedUserUseCase.execute();
        this.getFriends();
    }

    private getFriends(): void {
        this.getFriendshipsByUsernameUseCase.execute(this.user.profile.username).pipe(
            switchMap((friendships) => {
                this.friendships = friendships;
                return forkJoin(friendships.map((friendship) => this.getProfileByIdUseCase.execute(friendship.friendProfileId)))
            })
        ).subscribe((users) => {
            users.forEach((user) => {
                const friendshipTO: FriendshipTO = {
                    status: FriendshipStatusEnum.ADDED,
                    addDate: null,
                    id: null,
                    profileId: this.friendships[0].profileId,
                    profileTO: ProfileMapper.toDTO(user),
                };
                this.friendshipTO.push(friendshipTO);
            })
            this.filteredFriendshipTO = this.friendshipTO;
        })
    }

    getUser() {
        this.getUserByUsernameUseCase.execute(this.user.profile.username).subscribe((user) => this.user = user);
    }

    redirect(username) {
        this.router.navigate(['', username])
            .then(() => {
                window.location.reload();
            });
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
                    // TODO refazer a chamada no serviço
                    this.friendshipStatus = 'sent';
                    Util.showSuccessDialog(message);
                },
                (error) => console.log(error),
            );
    }

    deleteRequest(username: string) {
        Util.loadingScreen();
        this.getFriendshipRequestByUsernameUseCase.execute(username).pipe(
            finalize(() => Util.stopLoading()),
            switchMap((friendship) => this.deleteFriendshipRequestUseCase.execute(friendship.id)),
            switchMap(() => this.translate.get('PADRAO.SOLICITACAO_N_ACEITA')),
        ).subscribe(message => {
            Util.showSuccessDialog(message);
            this.getFriends();
        });
    }

    acceptRequest(username: string) {
        Util.loadingScreen();
        this.getFriendshipRequestByUsernameUseCase.execute(username).pipe(
            finalize(() => Util.stopLoading()),
            switchMap((friendship) => this.acceptFriendshipUseCase.execute(friendship.id)),
            switchMap(() => this.translate.get('PADRAO.SOLICITACAO_ACEITA')),
        ).subscribe(message => {
            Util.showSuccessDialog(message);
            this.getFriends();
        });
    }

    deleteFriend(idProfile: string) {
        this.deleteFriendshipUseCase.execute(idProfile).subscribe(() => {
            this.getFriends();
        }, error => {
            console.log(error);
        });
    }

    filterFriends(): void {
        let search = this.formSearch.get('search').value;
        if (search) {
            search = search.toLowerCase();
            this.filteredFriendshipTO = this.friendshipTO?.filter(friendship =>
                friendship.profileTO.name.concat(friendship.profileTO.lastName).toLocaleLowerCase().replace(' ', '')
                    .includes(search.toLocaleLowerCase().replace(' ', '')) ||
                friendship.profileTO.username.toLowerCase().includes(search),
            );
            return;
        }
        this.filteredFriendshipTO = this.friendshipTO;
    }

}
