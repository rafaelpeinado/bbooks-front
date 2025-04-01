import { Observable } from 'rxjs';
import { Friendship } from '../domain/entities/friendship.entity';

export abstract class FriendshipRepository {
    abstract createFriendship(friendProfileId: string): Observable<string>;
    abstract getAllFriendships(): Observable<Friendship[]>;
    abstract acceptFriendship(friendshipId: string): Observable<string>;
    abstract deleteFriendship(friendProfileId: string): Observable<string>;
    abstract getFriendshipByUsername(username: string): Observable<Friendship>;
    abstract getFriendshipsByUsername(username: string): Observable<Friendship[]>;
    abstract getFriendshipRequestByUsername(username: string): Observable<Friendship>;
    abstract deleteFriendshipRequest(requestId: string): Observable<string>;
    abstract getFriends(): Observable<Friendship[]>;
}
