import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseInterface } from '../use-case.interface';
import { FriendshipRepository } from '../../repositories/friendship.repository';

@Injectable({
    providedIn: 'root',
})

export class CreateFriendshipUseCase implements UseCaseInterface {
    constructor(private friendshipRepository: FriendshipRepository) { }

    execute(friendProfileId: string): Observable<string> {
        return this.friendshipRepository.createFriendship(friendProfileId);
    }
}

