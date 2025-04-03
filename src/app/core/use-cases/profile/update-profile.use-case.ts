import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/entities/user.entity';
import { UseCaseInterface } from '../use-case.interface';
import { ProfileRepository } from '../../repositories/profile.repository';

@Injectable({
    providedIn: 'root',
})

export class UpdateProfileUseCase implements UseCaseInterface {
    constructor(private readonly profileRepository: ProfileRepository) { }

    execute(user: User): Observable<User> {
        return this.profileRepository.updateProfile(user);
    }
}

