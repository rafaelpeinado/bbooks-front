import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseInterface } from '../use-case.interface';
import { FriendshipRepository } from '../../repositories/friendship.repository';

@Injectable({
    providedIn: 'root',
})

export class AcceptFriendshipUseCase implements UseCaseInterface {
    constructor(private readonly friendshipRepository: FriendshipRepository) { }

    execute(friendProfileId: string): Observable<string> {
        return this.friendshipRepository.acceptFriendship(friendProfileId);
    }
}
