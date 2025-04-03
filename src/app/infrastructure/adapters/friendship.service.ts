import { BaseApiService } from './base-service.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FriendshipRepository } from 'src/app/core/repositories/friendship.repository';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FriendshipRequestTO, FriendshipTO, GetFriendshipsByUsernameTO } from '../dtos/friendship.dto';
import { Friendship } from 'src/app/core/domain/entities/friendship.entity';
import { FriendshipMapper } from '../mappers/friendship.mapper';
import { FriendshipBuilder } from 'src/app/core/domain/builders/friendship.builder';
import { getFriendshipStatus } from 'src/app/core/domain/enums/friendship-status.enum';

@Injectable({
    providedIn: 'root'
})
export class FriendshipApiService extends BaseApiService<Friendship, FriendshipTO> implements FriendshipRepository {
    private readonly api: string = environment.api + 'friends/';
    private readonly apiRequests = this.api + 'requests/';

    constructor(protected readonly http: HttpClient) {
        super(http);
    }

    deleteFriendship(friendProfileId: string): Observable<string> {
        return this.http.delete<string>(this.api + friendProfileId);
    }

    getFriends(): Observable<Friendship[]> {
        return this.http.get<GetFriendshipsByUsernameTO>(this.api).pipe(
            first(),
            map((friendshipTO) => {
                return friendshipTO.friends.map((friend) => {
                    const friendship: Friendship = FriendshipBuilder.builder()
                        .setId(friendshipTO?.id)
                        .setFriendProfileId(friend?.profile?.id)
                        .setProfileId(friendshipTO?.profileId)
                        .build();
                    return friendship;
                });
            }),
        );
    }

    getFriendshipRequestByUsername(username: string): Observable<Friendship> {
        return this.http.get<FriendshipRequestTO>(this.apiRequests + username).pipe(
            first(),
            map((friendshipTO) => FriendshipBuilder.builder()
                .setId(friendshipTO.id)
                .setProfileId(friendshipTO.profile1)
                .setFriendProfileId(friendshipTO.profile2)
                .setAddedDate(friendshipTO.addDate)
                .setFriendshipStatus(getFriendshipStatus(friendshipTO.status))
                .build(),
            )
        );
    }

    deleteFriendshipRequest(requestId: string): Observable<string> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { id: requestId },
        };
        return this.http.delete<string>(this.apiRequests, options);
    }

    getFriendshipsByUsername(username: string): Observable<Friendship[]> {
        return this.http.get<GetFriendshipsByUsernameTO>(this.api + username).pipe(
            first(),
            map((friendshipTO) => {
                return friendshipTO.friends.map((friend) => {
                    const friendship: Friendship = FriendshipBuilder.builder()
                        .setId(friendshipTO.id)
                        .setFriendProfileId(friend.profile.id)
                        .setProfileId(friendshipTO.profileId)
                        .build();
                    return friendship;
                });
            }),
        );
    }

    getFriendshipByUsername(username: string): Observable<Friendship> {
        const service = this.http.get<FriendshipTO>(this.api + 'requests/' + username);
        return this.handleRequestDTOToEntity(service, FriendshipMapper.toEntity);
    }

    acceptFriendship(friendshipId: string): Observable<string> {
        return this.http.put<string>(this.apiRequests, { id: friendshipId }).pipe(first());
    }

    getAllFriendships(): Observable<Friendship[]> {
        return this.http.get<FriendshipTO[]>(this.apiRequests).pipe(
            first(),
            map((friendships) => friendships.map((friendship) => FriendshipMapper.toEntity(friendship)))
        );
    }

    createFriendship(friendProfileId: string): Observable<string> {
        return this.http.post<string>(this.apiRequests, { id: friendProfileId }).pipe(first());
    }
}
