import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompetitionMemberTO } from '../../../models/competitionMemberTO.model';
import { CompetitionVotesSaveTO } from '../../../models/competitionVotesSaveTO.model';
import { CompetitionVoteService } from '../../../services/competition-vote.service';
import { finalize, switchMap, take } from 'rxjs/operators';
import { Util } from '../../shared/utils/util';
import { CompetitionMemberService } from '../../../services/competition-member.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompetitionVoteReturnTO } from '../../../models/competitionVoteReturnTO.model';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetProfileByIdUseCase } from 'src/app/core/use-cases/profile/get-profile-by-id.use-case';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {

    formVote: FormGroup;
    competitionVotesSaveTO: CompetitionVotesSaveTO;
    isVoted: boolean;
    competitionVoteReturnTO: CompetitionVoteReturnTO;

    constructor(
        @Inject(MAT_DIALOG_DATA) public member: CompetitionMemberTO,
        public dialogRef: MatDialogRef<VoteComponent>,
        private competitionVoteService: CompetitionVoteService,
        private competitionMemberService: CompetitionMemberService,
        private formBuilder: FormBuilder,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private getProfileByIdUseCase: GetProfileByIdUseCase,
    ) {
    }

    ngOnInit(): void {
        this.verifyVoted();
        this.createForm();
        this.getProfile();
    }

    createForm() {
        this.formVote = this.formBuilder.group({
            id: new FormControl(this.competitionVoteReturnTO?.id ? this.competitionVoteReturnTO.id : null),
            memberId: new FormControl(this.competitionVoteReturnTO?.member?.memberId ? this.competitionVoteReturnTO.member.memberId : null),
            profileId: new FormControl(this.competitionVoteReturnTO?.profile?.id ? this.competitionVoteReturnTO.profile.id : null),
            value: new FormControl(this.competitionVoteReturnTO?.value ? this.competitionVoteReturnTO.value : null, Validators.compose([
                Validators.max(10),
                Validators.min(1)
            ]
            ))
        });
    }

    vote() {
        const user: User = this.getCachedUserUseCase.execute();
        const competitionVotesSaveTO = new CompetitionVotesSaveTO();
        competitionVotesSaveTO.memberId = this.member.memberId;
        competitionVotesSaveTO.profileId = +user.profile.id;
        competitionVotesSaveTO.value = this.formVote.get('value').value;
        this.competitionVoteService.vote(competitionVotesSaveTO)
            .pipe(take(1))
            .subscribe(result => {
                Util.showSuccessDialog('Seu voto foi registrado com sucesso!');
                this.dialogClose();
            }, error => {
                console.log(error);
            });
    }

    getProfile() {
        Util.loadingScreen();
        this.competitionMemberService.getMember(this.member.memberId)
            .pipe(
                finalize(() => Util.stopLoading()),
                take(1),
                switchMap((result) => this.getProfileByIdUseCase.execute(result.profile.id))
            ).subscribe(
                (user) => this.member.profile = ProfileMapper.toDTO(user),
                (error) => console.log(error),
            );
    }

    verifyVoted() {
        const user: User = this.getCachedUserUseCase.execute();
        this.competitionVoteService.getVoteByMemberAndProfile(this.member.memberId, user.profile.id)
            .pipe(take(1))
            .subscribe(result => {
                this.competitionVoteReturnTO = result;
                this.createForm();
            }, error => {
                console.log(error);
            });
    }

    updateVote() {
        this.competitionVoteService.updateVote(this.competitionVoteReturnTO.id, this.formVote.value)
            .pipe(take(1))
            .subscribe(result => {
                Util.showSuccessDialog('A nova nota foi atribuída com sucesso!');
                this.dialogClose();
            });
    }

    dialogClose() {
        this.dialogRef.close();
    }

}
