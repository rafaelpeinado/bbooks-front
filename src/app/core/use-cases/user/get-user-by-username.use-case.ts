import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UseCaseInterface } from '../use-case.interface';
import { GetTokenUseCase } from '../auth/get-token.use-case';

@Injectable({
    providedIn: 'root',
})

export class GetUserByUsernameUseCase implements UseCaseInterface {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly getTokenUseCase: GetTokenUseCase,
    ) { }

    execute(username: string): Observable<User> {
        const userToken: string = this.getTokenUseCase.execute();
        return this.userRepository.getUserByUsername(username, userToken);
    }
}
