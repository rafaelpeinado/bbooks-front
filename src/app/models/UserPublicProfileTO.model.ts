import { List } from '@zxing/library/es2015/customTypings';
import { Profile } from './profileTO.model';
import { UserTO } from '../infrastructure/dtos/user.dto';

export class UserPublicProfileTO {
    id: string;
    name: string;
    description: string;
    user: UserTO;
    createdAt: Date;
    followers: List<Profile>;
}
