import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UserTO } from '../../models/userTO.model';
import { UserService } from '../../services/user.service';
import { map, take } from 'rxjs/operators';
import { FriendsService } from '../../services/friends.service';
import { FriendRequest } from '../../models/friendRequest.model';
import { Friend } from '../../models/friend.model';
import { ProfileService } from 'src/app/services/profile.service';
import { BookService } from 'src/app/services/book.service';
import { GoogleBooksService } from 'src/app/services/google-books.service';
import { Util } from '../../views/shared/Utils/util';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
    isLogged: boolean;
    user: UserTO;
    menuPerfil;
    requests: FriendRequest[];
    publicProfileId = '';
    timer;
    constructor(
        public auth: AuthService,
        private router: Router,
        public translate: TranslateService,
        private userService: UserService,
        private friendService: FriendsService,
        private profileService: ProfileService,
        private bookService: BookService,
        private gBookService: GoogleBooksService,
    ) {
        translate.addLangs(['pt-BR', 'en']);
        translate.setDefaultLang('pt-BR');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/pt-BR|en/) ? browserLang : 'pt-BR');
    }

    ngOnInit(): void {
        this.isLogged = this.auth.isLogged();
        this.auth.logged.subscribe(eventLogged => {
            this.isLogged = eventLogged;
            this.getuser();
        });
        this.getuser();
        this.refreshRequest();
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
                    this.auth.logout();
                    this.router.navigateByUrl('/login');
                    console.log('error getRequests', error);
                });
        }
    }

    verifyRequests() {
        const result = this.requests?.filter(request => request.status === 'received');
        if (result?.length > 0) {
            return result.length;
        } else {
            return '';
        }
    }

    getuser() {
        if (this.isLogged) {
            this.userService.getById(this.auth.getUser().id).pipe(
                take(1))
                .subscribe(user => {
                    this.user = user;
                });
            this.getRequests();
        }

    }

    switchLang(lang: string): void {
        this.translate.use(lang);
        this.auth.language.emit(lang);
    }

    logout() {
        this.auth.logout();
        document.location.reload();
        this.router.navigate(['']);
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

    routerRecommendation(idGoogleBook: string): any {
        return idGoogleBook ? { api: 'google' } : {};
    }
}
