import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CompetitionMemberService } from '../../../services/competition-member.service';
import { LiteraryMemberStatus } from '../../../models/enums/LiteraryMemberStatus.enum';
import { Role } from '../../../models/enums/Role.enum';
import { CompetitionMemberSaveTO } from '../../../models/competitionMemberSaveTO.model';
import { Util } from '../../shared/Utils/util';
import { GetAllUsersUseCase } from 'src/app/core/use-cases/user/get-all-users.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-add-administrator',
    templateUrl: './add-administrator.component.html',
    styleUrls: ['./add-administrator.component.scss']
})
export class AddAdministratorComponent implements OnInit {

    formSearch: FormGroup;
    users: User[];
    filterUsers: User[] = [];
    literaryCompetitionId: string;
    isAdmin: boolean;

    constructor(
        private route: ActivatedRoute,
        private competitionMemberService: CompetitionMemberService,
        private formBuilder: FormBuilder,
        private getAllUsersUseCase: GetAllUsersUseCase,
    ) {
        this.formSearch = this.formBuilder.group({
            search: ['']
        });
    }

    ngOnInit(): void {
        this.route.params.pipe(
            map(params => params.id),
            tap(id => this.literaryCompetitionId = id),
            switchMap(() => this.getAllUsersUseCase.execute()),
        ).subscribe(users => this.users = users);
    }

    searchAdmins() {
        const formSearch = this.formSearch.get('search').value;
        this.filterUsers = this.users.filter(user =>
            user?.name.concat(user?.lastName).toLocaleLowerCase().replace(' ', '')
                .includes(formSearch.toLocaleLowerCase().replace(' ', '')));

    }

    addAdmin(id: number) {
        Util.loadingScreen();
        const competitionMemberSaveTO = new CompetitionMemberSaveTO();
        competitionMemberSaveTO.title = null;
        competitionMemberSaveTO.story = null;
        competitionMemberSaveTO.profileId = id;
        competitionMemberSaveTO.role = Role.admin;
        competitionMemberSaveTO.status = LiteraryMemberStatus.accept;
        competitionMemberSaveTO.competitionId = this.literaryCompetitionId;

        this.competitionMemberService.saveMember(competitionMemberSaveTO)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
            }, error => {
                Util.stopLoading();
                console.log(error);
            });
    }

}
