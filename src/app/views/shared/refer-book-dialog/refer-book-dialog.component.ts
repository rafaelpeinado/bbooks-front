import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Book } from 'src/app/models/book.model';
import { BookRecommendationTO } from 'src/app/models/bookRecommendationTO.model';
import { BookRecommendationService } from 'src/app/services/book-recommendation.service';
import { GroupInviteTO } from '../../../models/GroupInviteTO.model';
import { switchMap } from 'rxjs/operators';
import { Util } from '../utils/util';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { FriendshipStatusEnum } from 'src/app/core/domain/enums/friendship-status.enum';
import { FriendshipTO } from 'src/app/infrastructure/dtos/friendship.dto';
import { forkJoin } from 'rxjs';
import { GetFriendshipsByUsernameUseCase } from 'src/app/core/use-cases/friendship/get-friendships-by-username.use-case';
import { GetProfileByIdUseCase } from 'src/app/core/use-cases/profile/get-profile-by-id.use-case';
import { Friendship } from 'src/app/core/domain/entities/friendship.entity';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';

@Component({
    selector: 'app-refer-book-dialog',
    templateUrl: './refer-book-dialog.component.html',
    styleUrls: ['./refer-book-dialog.component.scss']
})
export class ReferBookDialogComponent implements OnInit {


    pesquisarUsuarios;
    public bookRecommendationTO = new BookRecommendationTO();
    public Book: Book;
    public formRecommendation: FormGroup;
    public friendships: Friendship[] = [];
    public friendshipTO: FriendshipTO[] = [];
    public filteredFriendshipTO: FriendshipTO[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { book: Book, indicateMember: boolean, groupInviteTO: GroupInviteTO },
        public dialogRef: MatDialogRef<ReferBookDialogComponent>,
        private fb: FormBuilder,
        private bookRecommendationService: BookRecommendationService,
        public translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private getFriendshipsByUsernameUseCase: GetFriendshipsByUsernameUseCase,
        private getProfileByIdUseCase: GetProfileByIdUseCase,
    ) {
        this.pesquisarUsuarios = this.fb.group({
            user: ['']
        });
    }

    ngOnInit(): void {
        this.getFriends();
        this.createForm();
        this.Book = this.data.book;
    }

    private createForm(): void {
        this.formRecommendation = this.fb.group({
            comment: new FormControl(null, Validators.required)
        });
    }

    pesquisar(nome): void {
        if (nome) {
            nome = nome.toLowerCase();
            this.filteredFriendshipTO = this.friendshipTO?.filter(friendship =>
                friendship.profileTO.name.concat(friendship.profileTO.lastName).toLocaleLowerCase().replace(' ', '')
                    .includes(nome.toLocaleLowerCase().replace(' ', '')) ||
                friendship.profileTO.username.toLowerCase().includes(nome),
            );
            return;
        }
        this.filteredFriendshipTO = this.friendshipTO;
    }

    referBook(profileReceivedId: number): void {
        const user: User = this.getCachedUserUseCase.execute();
        this.bookRecommendationTO.profileSubmitter = +user.profile.id;
        this.bookRecommendationTO.profileReceived = profileReceivedId;
        this.Book.api === 'google' ?
            this.bookRecommendationTO.idBookGoogle = this.Book.id :
            // tslint:disable-next-line:radix
            this.bookRecommendationTO.idBook = Number.parseInt(this.Book.id);
        this.bookRecommendationTO.comentario = this.formRecommendation.get('comment').value;
        this.bookRecommendationService.save(this.bookRecommendationTO).subscribe(
            () => {
                this.translate.get('PADRAO.LIVRO_INDICADO').subscribe(text => {
                    Util.showSuccessDialog(text);
                });
            },
            error => {
                console.log('BookRecommendation Error', error);
            }
        );
    }

    verifyError(error: any, locationError: string): void {
        let codMessage = '';
        if (error.error.message.includes('GR006')) {
            codMessage = 'GR006';
        }
        if (codMessage) {
            this.translate.get('MESSAGE_ERROR.' + codMessage).subscribe(message => {
                Util.showErrorDialog(message);
            });
        } else {
            this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(msg => {
                Util.showErrorDialog(msg);
            });
            console.log(locationError + ': ', error);
        }
    }

    getFriends(): void {
        const user: User = this.getCachedUserUseCase.execute();
        this.getFriendshipsByUsernameUseCase.execute(user.profile.username).pipe(
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
}
