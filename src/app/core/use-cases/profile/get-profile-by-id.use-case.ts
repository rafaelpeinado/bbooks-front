import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/entities/user.entity';
import { UseCaseInterface } from '../use-case.interface';
import { ProfileRepository } from '../../repositories/profile.repository';

@Injectable({
    providedIn: 'root',
})

export class GetProfileByIdUseCase implements UseCaseInterface {
    constructor(private profileRepository: ProfileRepository) { }

    execute(profileId: string): Observable<User> {
        return this.profileRepository.getProfileById(profileId);
    }
}

