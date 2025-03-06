export enum FriendshipStatusEnum {
    RECEIVED = 'received',
    SENT = 'sent',
    ADDED = 'added',
    PENDING = 'pending',
}

export function getFriendshipStatus(value: string): FriendshipStatusEnum | undefined {
    return Object.values(FriendshipStatusEnum).includes(value as FriendshipStatusEnum)
        ? (value as FriendshipStatusEnum)
        : undefined;
}
