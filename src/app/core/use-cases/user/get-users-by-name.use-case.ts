import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UseCaseInterface } from '../use-case.interface';

@Injectable({
    providedIn: 'root',
})

export class GetUsersByNameUseCase implements UseCaseInterface {
    constructor(private userRepository: UserRepository) { }

    execute(input: string): Observable<User[]> {
        return this.userRepository.getUsersByName(input);
    }
}

