import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { CompetitionMemberService } from '../../../services/competition-member.service';
import { CompetitionTO } from '../../../models/competitionTO.model';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-list-literary-competition',
    templateUrl: './list-literary-competition.component.html',
    styleUrls: ['./list-literary-competition.component.scss']
})
export class ListLiteraryCompetitionComponent implements OnInit {

    loading = false;
    page = 0;
    competitions: CompetitionTO[] = [];

    constructor(
        private competitionMemberService: CompetitionMemberService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.getCompetitionByProfile();
    }

    getCompetitionByProfile() {
        this.loading = true;
        const user: User = this.getCachedUserUseCase.execute();
        this.competitionMemberService.getCompetitionByProfile(+user.profile.id, this.page, 12)
            .pipe(take(1))
            .subscribe(result => {
                this.loading = false;
                if (result.content.length > 0) {
                    this.page++;
                    this.competitions = this.competitions.concat(result.content);
                }
            });
    }

    onScroll() {
        this.getCompetitionByProfile();
    }

}
