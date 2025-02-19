import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, take } from 'rxjs/operators';
import { FriendsService } from '../../services/friends.service';
import { FriendRequest } from '../../models/friendRequest.model';
import { Friend } from '../../models/friend.model';
import { BookRecommendationService } from 'src/app/services/book-recommendation.service';
import { BookRecommendationTO } from 'src/app/models/bookRecommendationTO.model';
import { GroupMemberService } from '../../services/group-member.service';
import { GroupInviteTO } from '../../models/GroupInviteTO.model';
import { Util } from '../../views/shared/utils/util';
import { PublicProfileService } from '../../services/public-profile.service';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { LogoutUseCase } from 'src/app/core/use-cases/auth/logout.use-case';
import { GetIsLoggedUseCase } from 'src/app/core/use-cases/auth/get-is-logged.use-case';
import { Subscription } from 'rxjs';
import { UpdateUserInfoUseCase } from 'src/app/core/use-cases/user/update-user-info.use-case';
import { TemporaryService } from 'src/app/services/temporary.service';
import { GetUserByIdUseCase } from 'src/app/core/use-cases/user/get-user-by-id.use-case';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
    public isLogged: boolean;
    public user: User;
    private isLoggedSubscription: Subscription;

    menuPerfil;
    requests: FriendRequest[];
    recommendations: BookRecommendationTO[];
    invitesGroup: GroupInviteTO[];
    publicProfileId = '';
    timer;
    constructor(
        private getBookByIdUseCase: GetBookByIdUseCase,
        private router: Router,
        public translate: TranslateService,
        private friendService: FriendsService,
        private bookRecommendation: BookRecommendationService,
        private groupMembersService: GroupMemberService,
        private publicProfileService: PublicProfileService,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private logoutUseCase: LogoutUseCase,
        private getIsLoggedUseCase: GetIsLoggedUseCase,
        private updateUserInfoUseCase: UpdateUserInfoUseCase,
        private temporaryService: TemporaryService,
        private getUserByIdUseCase: GetUserByIdUseCase,
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
        this.getRecommendations();
        this.getInvitesGroup();
        this.getPublicProfileByUser();
    }

    refreshRequest() {
        this.timer = setInterval(() => {
            this.getRequests();
        }, 3000);
    }

    getRequests() {
        if (this.isLogged) {
            this.friendService.getRequests().subscribe(requests => {
                this.requests = requests;
            },
                error => {
                    this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                        Util.showErrorDialog(message);
                    });
                    clearInterval(this.timer);
                    this.logoutUseCase.execute()
                        .subscribe(() => {
                            this.router.navigateByUrl('/login');
                            console.log('error getRequests', error);
                        });
                });
        }
    }

    verifyRequests() {
        const result = this.requests?.filter(request => request.status === 'received');
        if (result?.length > 0 || this.invitesGroup?.length > 0) {
            return result?.length + this.invitesGroup?.length;
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

    aceptRequest(request: FriendRequest) {
        const acept = new Friend();
        acept.id = request.id;
        Util.stopLoading();
        this.friendService.acceptRequest(acept).subscribe(() => {
            Util.stopLoading();
            this.translate.get('PADRAO.SOLICITACAO_ACEITA').subscribe(message => {
                Util.showSuccessDialog(message);
            });
        });

    }

    deleteRequest(request: FriendRequest) {
        const acept = new Friend();
        acept.id = request.id;
        Util.stopLoading();
        this.friendService.deleteRequest(acept).subscribe(() => {
            Util.stopLoading();
            if (request.status === 'sent') {
                this.translate.get('PADRAO.SOLICITACAO_CANCELADA').subscribe(message => {
                    Util.showSuccessDialog(message);
                });
            } else {
                this.translate.get('PADRAO.SOLICITACAO_N_ACEITA').subscribe(message => {
                    Util.showSuccessDialog(message);
                });
            }

        });
    }

    requestsSent(): FriendRequest[] {
        return this.requests?.filter(r => r.status === 'sent');
    }

    requestsReceived(): FriendRequest[] {
        return this.requests?.filter(r => r.status === 'received');
    }

    getRecommendations(): void {
        const user: User = this.getCachedUserUseCase.execute();
        this.bookRecommendation.getRecommentionsReceived(+user.profile.id)
            .pipe(
                map((recommendations: BookRecommendationTO[]) => {
                    return recommendations.map(r => {
                        // TODO
                        // TODO refatorar essa parte
                        // r.profileTO = this.getProfileByIdUseCase.execute(r.profileSubmitter);

                        let apiType: ApiType;
                        let id;

                        if (r.idBook) {
                            id = r.idBook;
                            apiType = ApiType.BBOOKS;
                        } else {
                            id = r.idBookGoogle;
                            apiType = ApiType.GOOGLE;
                        }
                        r.book = this.getBookByIdUseCase.execute(id, apiType);
                        return r;
                    });
                })
            )
            .subscribe(recommendations => {
                this.recommendations = recommendations;
            }, error => {
                console.log('Erro getRecommendation ', error);
            });
    }

    routerRecommendation(idGoogleBook: string): any {
        return idGoogleBook ? { api: 'google' } : {};
    }

    getInvitesGroup(): void {
        const user: User = this.getCachedUserUseCase.execute();
        this.groupMembersService.getInvites(user.id)
            .pipe(
                take(1),
                map(invites => {
                    return invites.map(i => {
                        i.inviterUser = this.getUserByIdUseCase.execute(user.id);
                        return i;
                    });
                })
            ).subscribe(result => {
                this.invitesGroup = result;
            });

    }

    acceptInviteGroup(id: string): void {
        Util.loadingScreen();
        this.groupMembersService.acceptInvite(id)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                this.translate.get('NAV.CONVITE_ACEITO').subscribe(message => {
                    Util.showSuccessDialog(message);
                });
                this.invitesGroup = this.invitesGroup.filter(i => i.id !== id);
            }, error => {
                Util.stopLoading();
                this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                    Util.showErrorDialog(message);
                });
                console.log('error accpet invite group', error);
            });
    }

    refuseInviteGroup(id: string): void {
        Util.loadingScreen();
        this.groupMembersService.refuseInvite(id)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                this.translate.get('NAV.CONVITE_RECUSADO').subscribe(message => {
                    Util.showSuccessDialog(message);
                });
                this.invitesGroup = this.invitesGroup.filter(i => i.id !== id);
            }, error => {
                Util.stopLoading();
                this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                    Util.showErrorDialog(message);
                });
                console.log('error refuse invite group', error);
            });
    }

    getPublicProfileByUser() {
        this.publicProfileId = '';
        const user: User = this.getCachedUserUseCase.execute();
        this.publicProfileService.getByUserId(user.id)
            .pipe(take(1))
            .subscribe(result => {
                if (result) {
                    this.publicProfileId = result.id;
                } else {
                    this.publicProfileId = '';
                }
            });
    }
}
