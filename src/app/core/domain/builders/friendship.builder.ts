import { Friendship } from '../entities/friendship.entity';
import { FriendshipStatusEnum } from '../enums/friendship-status.enum';
import { BuilderImpl } from './builder.builder';

export class FriendshipBuilder extends BuilderImpl<Friendship, FriendshipBuilder> {

    static builder() { return new this(); }

    setId(id: string): FriendshipBuilder { return this.set('id', id); }
    setProfileId(profileId: string): FriendshipBuilder { return this.set('profileId', profileId); }
    setFriendProfileId(friendProfileId: string): FriendshipBuilder { return this.set('friendProfileId', friendProfileId); }
    setFriendshipStatus(friendshipStatus: FriendshipStatusEnum): FriendshipBuilder { return this.set('friendshipStatus', friendshipStatus); }
    setAddedDate(addedDate: Date): FriendshipBuilder { return this.set('addedDate', addedDate); }
}