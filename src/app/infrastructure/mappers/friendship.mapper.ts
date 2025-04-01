import { FriendshipTO } from '../dtos/friendship.dto';
import { FriendshipBuilder } from 'src/app/core/domain/builders/friendship.builder';
import { Friendship } from 'src/app/core/domain/entities/friendship.entity';
import { getFriendshipStatus } from 'src/app/core/domain/enums/friendship-status.enum';

export class FriendshipMapper {

    static toEntity(friendshipTO: FriendshipTO): Friendship {
        const builder = FriendshipBuilder.builder();

        if (friendshipTO.profileTO && friendshipTO.profileTO.id) { builder.setFriendProfileId(friendshipTO.profileTO.id); }
        if (friendshipTO.id) { builder.setId(friendshipTO.id); }
        if (friendshipTO.addDate) { builder.setAddedDate(friendshipTO.addDate); }
        if (friendshipTO.status) { builder.setFriendshipStatus(getFriendshipStatus(friendshipTO.status)); }

        return builder.build();
    }

    static toDTO(friendship: Friendship): FriendshipTO {
        const FriendshipTO: FriendshipTO = {
            addDate: friendship.addedDate,
            id: friendship.id,
            profileTO: null,
            status: friendship.friendshipStatus,
            profileId: friendship.profileId,
        };

        return FriendshipTO;
    }
}
