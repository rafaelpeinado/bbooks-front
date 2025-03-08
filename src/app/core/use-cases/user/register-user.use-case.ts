import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UseCaseInterface } from '../use-case.interface';

@Injectable({
    providedIn: 'root',
})

export class RegisterUserUseCase implements UseCaseInterface {
    constructor(private readonly userRepository: UserRepository) { }

    execute(user: User): Observable<User> {
        return this.userRepository.registerUser(user);
    }
}

