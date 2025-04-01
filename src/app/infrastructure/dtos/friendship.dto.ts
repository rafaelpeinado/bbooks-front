import { ProfileTO, UserTO } from './user.dto';

export interface FriendshipTO {
    id: string;
    profileId: string;
    status: string;
    addDate: Date;
    profileTO: ProfileTO;
}

export interface GetFriendshipsByUsernameTO {
    id: string;
    profileId: string;
    status: string;
    addDate: Date;
    friends: UserTO[];
}

export interface FriendshipRequestTO {
    id: string;
    profile1: string;
    profile2: string;
    status: string;
    addDate: Date;
}
