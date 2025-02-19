import { User } from 'src/app/core/domain/entities/user.entity';
import { BaseApiService } from './base-service.service';
import { ProfileTO } from '../dtos/user.dto';
import { ProfileRepository } from 'src/app/core/repositories/profile.repository';
import { Observable } from 'rxjs';
import { ProfileMapper } from '../mappers/profile.mapper';
import { environment } from 'src/environments/environment';
import { Profile } from 'src/app/core/domain/entities/profile.entity';
import { first, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProfileApiService extends BaseApiService<Profile, ProfileTO> implements ProfileRepository {
    private api: string = environment.api + 'profiles/';

    constructor(protected http: HttpClient) {
        super(http);
    }

    updateProfile(user: User): Observable<User> {
        const profileTO: ProfileTO = ProfileMapper.toDTO(user);
        return this.http.put<ProfileTO>(this.api + profileTO.id, profileTO).pipe(
            first(),
            map((profileTO) => ProfileMapper.toUser(profileTO)),
        );
    }

    getProfileById(profileId: string): Observable<User> {
        return this.http.get<ProfileTO>(this.api + profileId).pipe(
            first(),
            map((profileTO) => ProfileMapper.toUser(profileTO)),
        );
    }

}
