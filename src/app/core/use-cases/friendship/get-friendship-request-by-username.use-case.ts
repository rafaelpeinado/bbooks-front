import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseInterface } from '../use-case.interface';
import { FriendshipRepository } from '../../repositories/friendship.repository';
import { Friendship } from '../../domain/entities/friendship.entity';

@Injectable({
    providedIn: 'root',
})

export class GetFriendshipRequestByUsernameUseCase implements UseCaseInterface {
    constructor(private readonly friendshipRepository: FriendshipRepository) { }

    execute(username: string): Observable<Friendship> {
        return this.friendshipRepository.getFriendshipRequestByUsername(username);
    }
}
