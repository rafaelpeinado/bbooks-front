import { Component, OnInit } from '@angular/core';
import { GroupTO } from '../../../models/GroupTO.model';
import { GroupMemberService } from '../../../services/group-member.service';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Util } from '../../shared/utils/util';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-your-group',
    templateUrl: './your-group.component.html',
    styleUrls: ['./your-group.component.scss']
})
export class YourGroupComponent implements OnInit {
    loading = false;
    page = 0;
    groups: GroupTO[] = [];

    constructor(
        private groupMemberService: GroupMemberService,
        private translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.getGroupsByUser();
    }

    getGroupsByUser(): void {
        this.loading = true;
        const user: User = this.getCachedUserUseCase.execute();
        this.groupMemberService.getGroupsByUser(user.id)
            .pipe(take(1))
            .subscribe(result => {
                this.groups = result;
                this.loading = false;
            },
                error => {
                    this.loading = false;
                    this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                        Util.showErrorDialog(message);
                    });
                    console.log('your-group getGroupsByUser', error);
                });
    }

}
