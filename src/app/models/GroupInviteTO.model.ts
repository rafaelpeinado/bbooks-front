import { Observable } from 'rxjs';
import { GroupTO } from './GroupTO.model';
import { User } from '../core/domain/entities/user.entity';

export class GroupInviteTO {
    id: string;
    groupId: string;
    group: GroupTO;
    userId: string;
    inviter: string;
    inviterUser: Observable<User>;
    groupInvite: Observable<GroupTO>;
}
