import { FriendshipStatusEnum } from "../enums/friendship-status.enum";

export interface Friendship {
    id: string;
    profileId: string;
    friendProfileId: string;
    friendshipStatus: FriendshipStatusEnum;
    addedDate: Date;
}
