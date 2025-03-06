import { ProfileTO } from '../infrastructure/dtos/user.dto';
import {CompetitionMemberTO} from './competitionMemberTO.model';


export class CompetitionVoteReturnTO {
    id: string;
    value: number;
    member: CompetitionMemberTO;
    profile: ProfileTO;
}
