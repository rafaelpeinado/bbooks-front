import { Role } from './enums/Role.enum';
import { MemberStatus } from './enums/MemberStatus.enum';
import { UserTO } from '../infrastructure/dtos/user.dto';

export class GroupMembers {
    userId: string;
    groupId: string;
    date: Date;
    role: Role;
    status: MemberStatus;
    user: UserTO;
}

export class Id {
    user: string;
    groupRead: string;
}
