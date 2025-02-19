import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, take } from 'rxjs/operators';
import { CompetitionService } from '../../../services/competition.service';
import { CompetitionTO } from '../../../models/competitionTO.model';
import { CompetitionMemberService } from '../../../services/competition-member.service';
import { CompetitionMemberTO } from '../../../models/competitionMemberTO.model';
import { Role } from '../../../models/enums/Role.enum';
import { Util } from '../../shared/utils/util';
import { CompetitionMemberSaveTO } from '../../../models/competitionMemberSaveTO.model';
import { LiteraryMemberStatus } from '../../../models/enums/LiteraryMemberStatus.enum';
import { StoryLiteraryCompetitionComponent } from '../story-literary-competition/story-literary-competition.component';
import { MatDialog } from '@angular/material/dialog';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { ProfileTO } from 'src/app/infrastructure/dtos/user.dto';
import { GetProfileByIdUseCase } from 'src/app/core/use-cases/profile/get-profile-by-id.use-case';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';

@Component({
    selector: 'app-literary-competition',
    templateUrl: './literary-competition.component.html',
    styleUrls: ['./literary-competition.component.scss']
})
export class LiteraryCompetitionComponent implements OnInit {

    competitionTO: CompetitionTO;
    members: CompetitionMemberTO[] = [];
    administrators: CompetitionMemberTO[] = [];
    literaryCompetitionId: string;
    page = 0;
    isAdmin = false;
    isMember = false;
    profile: ProfileTO;
    member: CompetitionMemberTO;
    dataAtual = Date.now();

    constructor(
        private route: ActivatedRoute,
        private competitionService: CompetitionService,
        private competitionMemberService: CompetitionMemberService,
        private dialog: MatDialog,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private getProfileByIdUseCase: GetProfileByIdUseCase,
    ) {
    }

    ngOnInit(): void {
        this.route.params
            .pipe(
                map(params => params.id)
            )
            .subscribe(result => {
                this.getById(result);
                this.literaryCompetitionId = result;
            }
            );
        this.isUserAdministrator();
        this.getProfile();
    }


    isUserAdministrator(): boolean {
        Util.loadingScreen();
        this.competitionMemberService.getMembers(this.literaryCompetitionId, this.page, 10)
            .pipe(take(1))
            .subscribe(result => {
                Util.stopLoading();
                if (result.content.length > 0) {
                    const user: User = this.getCachedUserUseCase.execute();
                    const r = result.content.find(i => i.profileId === user.profile.id);
                    this.page++;
                    if (r) {
                        this.member = r;
                        if (r.role === Role.owner || r.role === Role.admin) {
                            this.isAdmin = true;
                        } else {
                            this.isMember = true;
                        }
                    } else {
                        this.isUserAdministrator();
                    }
                }
            }, error => {
                console.log(error);
                Util.stopLoading();
            });
        return true;
    }

    getById(id: string) {
        this.competitionService.getById(id)
            .pipe(take(1))
            .subscribe(result => {
                this.competitionTO = result;
            }, error => {
                console.log(error);
            });
    }

    addMember() {
        Util.loadingScreen();
        const competitionMemberSaveTO = new CompetitionMemberSaveTO();
        competitionMemberSaveTO.competitionId = this.literaryCompetitionId;
        competitionMemberSaveTO.profileId = this.profile.id;
        competitionMemberSaveTO.role = Role.member;
        competitionMemberSaveTO.story = null;
        competitionMemberSaveTO.title = null;
        competitionMemberSaveTO.status = LiteraryMemberStatus.accept;
        this.competitionMemberService.saveMember(competitionMemberSaveTO)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                this.isMember = true;
                window.location.reload();
            }, error => {
                Util.stopLoading();
                console.log(error);
            });
    }

    removeMember() {
        Util.loadingScreen();
        this.competitionMemberService.exitMember(this.member.memberId)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                this.isMember = false;
            }, error => {
                Util.stopLoading();
                console.log(error);
            });
    }


    getProfile() {
        Util.loadingScreen();
        const user: User = this.getCachedUserUseCase.execute();

        this.getProfileByIdUseCase.execute(user.profile.id)
            .pipe(finalize(() => Util.stopLoading()))
            .subscribe(
                (user) => this.profile = ProfileMapper.toDTO(user),
                (error) => console.log(error),
            );
    }

    verifyDate(date: Date): boolean {
        if (date) {
            if (this.dataAtual <= Date.parse(date.toString())) {
                return true;
            }
            return false;
        }
    }

    verifyDateStart(date: Date): boolean {
        if (date) {
            if (this.dataAtual <= Date.parse(date.toString())) {
                return false;
            }
            return true;
        }
    }

    openDialogSeeStory(member: CompetitionMemberTO) {
        const dialogRef = this.dialog.open(StoryLiteraryCompetitionComponent, {
            height: '450px',
            width: '100%',
            data: member
        });
        dialogRef.afterClosed().subscribe((result) => {
            // this.getBook(result);
        });
    }
}
