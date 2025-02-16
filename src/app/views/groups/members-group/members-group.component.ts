import { Component, OnInit } from '@angular/core';
import { Util } from '../../shared/Utils/util';
import { take } from 'rxjs/operators';
import { GroupTO } from '../../../models/GroupTO.model';
import { ActivatedRoute } from '@angular/router';
import { GroupMemberService } from '../../../services/group-member.service';
import { GroupMembers } from '../../../models/GroupMembers.model';
import { TranslateService } from '@ngx-translate/core';
import { Role } from '../../../models/enums/Role.enum';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-members-group',
    templateUrl: './members-group.component.html',
    styleUrls: ['./members-group.component.scss']
})
export class MembersGroupComponent implements OnInit {
    groupTO: GroupTO;
    members: GroupMembers[];
    isAdmin = false;
    isMember = false;
    memberGroup: GroupMembers;
    role = Role;
    public formSearch: FormGroup;


    constructor(
        private route: ActivatedRoute,
        private groupMemberService: GroupMemberService,
        private translate: TranslateService,
        private formBuilder: FormBuilder,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
        this.formSearch = this.formBuilder.group({
            search: new FormControl(null)
        });
    }

    ngOnInit(): void {
        Util.loadingScreen();
        this.route.data.pipe(take(1)).subscribe((data: { groupTo: GroupTO }) => {
            Util.stopLoading();
            this.groupTO = data.groupTo;
            localStorage.setItem('groupId', this.groupTO.id);

            this.getMembers();
        });
    }

    getMembers(): void {
        Util.loadingScreen();
        this.groupMemberService.getGroupMembers(this.groupTO.id)
            .pipe(
                take(1)
            ).subscribe(result => {
                const user: User = this.getCachedUserUseCase.execute();
                Util.stopLoading();
                this.members = result;
                const member = result.find(m => m.user.id === user.id);
                this.memberGroup = member;
                if (member) {
                    if (member.role === Role.owner || member.role === Role.admin) {
                        this.isAdmin = true;
                    }
                    this.isMember = true;
                }
            }, error => {
                Util.stopLoading();
                this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                    Util.showErrorDialog(message);
                });
                console.log('Erro: members-group getMembers', error);
            });
    }

    updateMemberRole(groupMember: GroupMembers, role: Role): void {
        groupMember.role = role;
        groupMember.userId = groupMember.user.id;
        this.groupMemberService.enterGroup(groupMember)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                const textCode = role === Role.admin ? 'ADM_NOW' : 'MEMBER_NOW';
                this.translate.get('GRUPO_LEITURA.' + textCode).subscribe(message => {
                    Util.showSuccessDialog(message);
                });
            }, error => {
                Util.stopLoading();
                this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                    Util.showErrorDialog(message);
                });
                console.log('error updateMemberRole', error);
            });

    }

    removerMember(groupMember: GroupMembers, index: number): void {
        Util.loadingScreen();
        groupMember.userId = groupMember.user.id;
        this.groupMemberService.exitGroup(groupMember)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                this.members.splice(index, 1);
                this.translate.get('GRUPO_LEITURA.MEMBRO_REMOVIDO').subscribe(msg => {
                    Util.showSuccessDialog(msg);
                });
            },
                error => {
                    console.log('error remove member', error);
                    this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(msg => {
                        Util.showErrorDialog(msg);
                    });
                    Util.stopLoading();
                });
    }

    filterMembers(): GroupMembers[] {
        let search = this.formSearch.get('search').value;
        if (search) {
            search = search.toLowerCase();
            return this.members.filter(m =>
                m.user.profile.name.includes(search) ||
                m.user.profile.lastName.toLowerCase().includes(search) ||
                m.user.userName.toLowerCase().includes(search)
            );
        }
        return this.members;
    }
}
