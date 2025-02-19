import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, take } from 'rxjs/operators';
import { CompetitionMemberService } from '../../../services/competition-member.service';
import { CompetitionMemberTO } from '../../../models/competitionMemberTO.model';
import { Role } from '../../../models/enums/Role.enum';
import { Util } from '../../shared/utils/util';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LiteraryMemberStatus } from '../../../models/enums/LiteraryMemberStatus.enum';
import { GetProfileByIdUseCase } from 'src/app/core/use-cases/profile/get-profile-by-id.use-case';
import { ProfileMapper } from 'src/app/infrastructure/mappers/profile.mapper';

@Component({
    selector: 'app-administrators-literary-competition',
    templateUrl: './administrators-literary-competition.component.html',
    styleUrls: ['./administrators-literary-competition.component.scss']
})
export class AdministratorsLiteraryCompetitionComponent implements OnInit {


    loading = false;
    literaryCompetitionId: string;
    page = 0;
    administrators: CompetitionMemberTO[] = [];
    searchAdministrators: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private competitionMemberService: CompetitionMemberService,
        private fb: FormBuilder,
        private getProfileByIdUseCase: GetProfileByIdUseCase,
    ) {
        this.searchAdministrators = this.fb.group({
            nameAdministrator: ['']
        });
    }

    ngOnInit(): void {
        this.route.params
            .pipe(
                map(params => params.id)
            )
            .subscribe(result => {
                this.literaryCompetitionId = result;
                this.getOwner();
                this.getMembers();
            }
            );
    }

    getOwner() {
        this.competitionMemberService.getMembersByRoleAndStatus(this.literaryCompetitionId, Role.owner, LiteraryMemberStatus.pending)
            .pipe(take(1))
            .subscribe(result => {
                this.administrators = result;
            });
    }

    getMembers() {
        this.competitionMemberService.getMembersByRoleAndStatus(this.literaryCompetitionId, Role.admin, LiteraryMemberStatus.accept)
            .pipe(take(1))
            .subscribe(result => {
                this.administrators = this.administrators.concat(result);
            });
    }

    getProfiles() {
        Util.loadingScreen();
        this.administrators.forEach((a, i) => {
            if (!a.profile) {
                this.getProfileByIdUseCase.execute(a.profileId)
                    .pipe(finalize(() => Util.stopLoading()))
                    .subscribe(
                        (user) => this.administrators[i].profile = ProfileMapper.toDTO(user),
                        (error) => console.log(error),
                    );
            }
        });
    }

    searchAdministrator() {
        const formSearch = this.searchAdministrators.get('nameAdministrator').value;
        if (!formSearch) {
            return this.administrators;
        }
        return this.administrators.filter(p =>
            p?.profile?.name.concat(p?.profile?.lastName).toLocaleLowerCase().replace(' ', '')
                .includes(formSearch.toLocaleLowerCase().replace(' ', ''))
        );
    }

    /*onScroll() {
        this.getMembers();
    }*/

}
