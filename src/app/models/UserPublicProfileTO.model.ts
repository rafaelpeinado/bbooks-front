import { List } from '@zxing/library/es2015/customTypings';
import { ProfileTO, UserTO } from '../infrastructure/dtos/user.dto';

export class UserPublicProfileTO {
    id: string;
    name: string;
    description: string;
    user: UserTO;
    createdAt: Date;
    followers: List<ProfileTO>;
}
