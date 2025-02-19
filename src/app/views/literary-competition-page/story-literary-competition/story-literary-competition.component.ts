import { Component, Inject, OnInit } from '@angular/core';
import { finalize, switchMap, take } from 'rxjs/operators';
import { CompetitionMemberService } from '../../../services/competition-member.service';
import { CompetitionMemberTO } from '../../../models/competitionMemberTO.model';
import { Util } from '../../shared/utils/util';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetProfileByIdUseCase } from 'src/app/core/use-cases/profile/get-profile-by-id.use-case';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';

@Component({
    selector: 'app-story-literary-competition',
    templateUrl: './story-literary-competition.component.html',
    styleUrls: ['./story-literary-competition.component.scss']
})
export class StoryLiteraryCompetitionComponent implements OnInit {

    memberId: string;
    members: CompetitionMemberTO[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public member: CompetitionMemberTO,
        private competitionMemberService: CompetitionMemberService,
        private getProfileByIdUseCase: GetProfileByIdUseCase,
        public dialogRef: MatDialogRef<StoryLiteraryCompetitionComponent>,
    ) {
    }

    ngOnInit(): void {
        this.getProfile();
    }

    getMember() {
        this.competitionMemberService.getMember(this.memberId)
            .pipe(take(1))
            .subscribe(member => {
                this.member = member;
                this.getProfile();
            }, error => {
                console.log(error);
            });
    }

    getProfile() {
        Util.loadingScreen();
        this.competitionMemberService.getMember(this.member.memberId)
            .pipe(
                take(1),
                finalize(() => Util.stopLoading()),
                switchMap((result) => this.getProfileByIdUseCase.execute(result.profile.id))
            ).subscribe(
                (user) => this.member.profile = ProfileMapper.toDTO(user),
                (error) => console.log(error),
            );
    }

    dialogClose() {
        this.dialogRef.close();
    }
}
