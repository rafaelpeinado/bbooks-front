import { Role } from './enums/Role.enum';
import { Profile } from './profileTO.model';
import { CompetitionTO } from './competitionTO.model';
import { Observable } from 'rxjs';
import { LiteraryMemberStatus } from './enums/LiteraryMemberStatus.enum';
import { ProfileTO } from '../infrastructure/dtos/user.dto';

export class CompetitionMemberTO {
    memberId: string;
    title: string;
    story: string;
    profile: ProfileTO;
    profileAsinc: Observable<Profile>;
    profileId: string;
    role: Role;
    status: LiteraryMemberStatus;
    competitionTO: CompetitionTO;
    meanVote: number;
}
