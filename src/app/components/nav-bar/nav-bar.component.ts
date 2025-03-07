import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { FriendRequest } from '../../models/friendRequest.model';
import { Friend } from '../../models/friend.model';
import { Util } from '../../views/shared/utils/util';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { LogoutUseCase } from 'src/app/core/use-cases/auth/logout.use-case';
import { GetIsLoggedUseCase } from 'src/app/core/use-cases/auth/get-is-logged.use-case';
import { of, Subscription, throwError } from 'rxjs';
import { UpdateUserInfoUseCase } from 'src/app/core/use-cases/user/update-user-info.use-case';
import { TemporaryService } from 'src/app/services/temporary.service';
import { GetUserByIdUseCase } from 'src/app/core/use-cases/user/get-user-by-id.use-case';
import { FriendshipStatusEnum } from 'src/app/core/domain/enums/friendship-status.enum';
import { GetAllFriendshipsUseCase } from 'src/app/core/use-cases/friendship/get-all-friendships.use-case';
import { Friendship } from 'src/app/core/domain/entities/friendship.entity';
import { FriendshipTO } from 'src/app/infrastructure/dtos/friendship.dto';
import { GetProfileByIdUseCase } from 'src/app/core/use-cases/profile/get-profile-by-id.use-case';
import { FriendshipMapper } from 'src/app/infrastructure/mappers/friendship.mapper';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';
import { AcceptFriendshipUseCase } from 'src/app/core/use-cases/friendship/accept-friendship.use-case';
import { DeleteFriendshipRequestUseCase } from 'src/app/core/use-cases/friendship/delete-friendship-request.use-case';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
    public isLogged: boolean;
    public user: User;
    public sentFriendships: FriendshipTO[] = [];
    public receivedFriendships: FriendshipTO[] = [];
    private sentAndReceivedStatus: FriendshipStatusEnum[] = [FriendshipStatusEnum.RECEIVED, FriendshipStatusEnum.SENT];
    private setSentFriendships: Set<string> = new Set<string>();
    private setReceivedFriendships: Set<string> = new Set<string>();
    private isLoggedSubscription: Subscription;

    menuPerfil;
    public friendships: Friendship[];
    publicProfileId = '';
    timer;
    constructor(
        private router: Router,
        public translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private logoutUseCase: LogoutUseCase,
        private getIsLoggedUseCase: GetIsLoggedUseCase,
        private updateUserInfoUseCase: UpdateUserInfoUseCase,
        private temporaryService: TemporaryService,
        private getUserByIdUseCase: GetUserByIdUseCase,
        private getAllFriendshipsUseCase: GetAllFriendshipsUseCase,
        private getProfileByIdUseCase: GetProfileByIdUseCase,
        private acceptFriendshipUseCase: AcceptFriendshipUseCase,
        private deleteFriendshipRequestUseCase: DeleteFriendshipRequestUseCase,
    ) {
        translate.addLangs(['pt-BR', 'en']);
        translate.setDefaultLang('pt-BR');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/pt-BR|en/) ? browserLang : 'pt-BR');
    }

    ngOnDestroy(): void {
        this.isLoggedSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.isLoggedSubscription = this.getIsLoggedUseCase.execute()
            .subscribe((isLogged) => {
                this.isLogged = isLogged;
                this.getuser();
            });
        this.refreshRequest();
    }

    refreshRequest() {
        this.timer = setInterval(() => {
            this.getRequests();
        }, 3000);
    }

    getRequests() {
        if (this.isLogged) {
            this.getAllFriendshipsUseCase.execute().subscribe((friendships) => {
                this.friendships = friendships;
                const sentOrReceivedFrienships = this.friendships.filter(friendship => {
                    const hasReceivedFriendships = this.setReceivedFriendships.has(friendship.id);
                    const hasSentFriendships = this.setSentFriendships.has(friendship.id);
                    const isSentOrReceivedStatus = this.sentAndReceivedStatus.includes(friendship.friendshipStatus);
                    return !hasReceivedFriendships && !hasSentFriendships && isSentOrReceivedStatus;
                });
                sentOrReceivedFrienships.forEach((sentOrReceivedFriendship) =>
                    this.getProfileByIdUseCase.execute(sentOrReceivedFriendship.friendProfileId)
                        .subscribe((user) => {
                            const friendshipTO: FriendshipTO = FriendshipMapper.toDTO(sentOrReceivedFriendship);
                            friendshipTO.profileTO = ProfileMapper.toDTO(user);
                            if (sentOrReceivedFriendship.friendshipStatus === FriendshipStatusEnum.SENT) {
                                this.addSentFriendships(friendshipTO);
                            } else {
                                this.addReceivedFriendships(friendshipTO);
                            }

                        })
                );
            }, (error) => this.handleError(error));
        }
    }



    verifyRequests() {
        const result = this.friendships?.filter(friendship => friendship.friendshipStatus === 'received');
        if (result?.length > 0) {
            return result?.length
        } else {
            return '';
        }
    }

    getuser() {
        if (this.isLogged) {
            const user: User = this.getCachedUserUseCase.execute();
            if (user) {
                this.getUserByIdUseCase.execute(user.id)
                    .subscribe((user) => this.user = user);
            } else {
                this.updateUserInfoUseCase.execute()
                    .subscribe((user) => this.user = user);
            }

            this.getRequests();
        }

    }

    switchLang(lang: string): void {
        this.translate.use(lang);
        this.temporaryService.language.emit(lang);
    }

    logout() {
        this.logoutUseCase.execute()
            .subscribe(() => {
                this.router.navigate(['']);
            });
    }

    acceptRequest(friendshipTO: FriendshipTO) {
        const accept = new Friend();
        accept.id = +friendshipTO.id;
        Util.loadingScreen();
        this.acceptFriendshipUseCase.execute(friendshipTO.id).pipe(
            finalize(() => Util.stopLoading())
        ).subscribe(() => {
            if (this.setSentFriendships.has(friendshipTO.id)) {
                this.setSentFriendships.delete(friendshipTO.id);
                this.sentFriendships = this.sentFriendships.filter((sentFriendship) => sentFriendship.id !== friendshipTO.id)
            }

            if (this.setReceivedFriendships.has(friendshipTO.id)) {
                this.setReceivedFriendships.delete(friendshipTO.id);
                this.receivedFriendships = this.receivedFriendships.filter((sentFriendship) => sentFriendship.id !== friendshipTO.id)
            }

            this.translate.get('PADRAO.SOLICITACAO_ACEITA').subscribe(message => {
                Util.showSuccessDialog(message);
            });
        })
    }

    deleteRequest(friendship: FriendRequest) {
        Util.stopLoading();

        this.deleteFriendshipRequestUseCase.execute(friendship.id).pipe(
            finalize(() => Util.stopLoading()), // Garante que stopLoading será chamado
            switchMap(() => {
                const messageKey = friendship.status === 'sent'
                    ? 'PADRAO.SOLICITACAO_CANCELADA'
                    : 'PADRAO.SOLICITACAO_N_ACEITA';

                return this.translate.get(messageKey);
            }),
            catchError(error => {
                Util.showErrorDialog('Erro ao excluir solicitação de amizade.');
                return throwError(() => error);
            })
        ).subscribe(message => Util.showSuccessDialog(message));
    }

    routerRecommendation(idGoogleBook: string): any {
        return idGoogleBook ? { api: 'google' } : {};
    }

    private handleError(error: any) {
        this.translate.get('PADRAO.OCORREU_UM_ERRO').pipe(
            switchMap(message => {
                clearInterval(this.timer)
                Util.showErrorDialog(message);
                return this.logoutUseCase.execute();
            }),
            tap(() => {
                this.router.navigateByUrl('/login');
                console.error('Error getRequests', error);
            }),
            catchError(logoutError => {
                console.error('Erro ao deslogar:', logoutError);
                return of(null);
            })
        ).subscribe();
    }

    private addSentFriendships(friendshipTO: FriendshipTO): void {
        if (!this.setSentFriendships.has(friendshipTO.id)) {
            this.setSentFriendships.add(friendshipTO.id)
            this.sentFriendships.push(friendshipTO);
        }
    }

    private addReceivedFriendships(friendshipTO: FriendshipTO): void {
        if (!this.setReceivedFriendships.has(friendshipTO.id)) {
            this.setReceivedFriendships.add(friendshipTO.id)
            this.receivedFriendships.push(friendshipTO);
        }
    }
}
