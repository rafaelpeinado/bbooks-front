import { Role } from './enums/Role.enum';
import { CompetitionTO } from './competitionTO.model';
import { Observable } from 'rxjs';
import { LiteraryMemberStatus } from './enums/LiteraryMemberStatus.enum';
import { ProfileTO } from '../infrastructure/dtos/user.dto';

export class CompetitionMemberTO {
    memberId: string;
    title: string;
    story: string;
    profile: ProfileTO;
    profileAsinc: Observable<ProfileTO>;
    profileId: string;
    role: Role;
    status: LiteraryMemberStatus;
    competitionTO: CompetitionTO;
    meanVote: number;
}
