import {Role} from './enums/Role.enum';
import {LiteraryMemberStatus} from './enums/LiteraryMemberStatus.enum';

export class CompetitionMemberSaveTO {
    memberId: string;
    title: string;
    story: string;
    profileId: string;
    role: Role;
    status: LiteraryMemberStatus;
    competitionId: string;
}
