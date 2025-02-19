import { Observable } from 'rxjs';
import { User } from '../domain/entities/user.entity';

export abstract class ProfileRepository {
    abstract updateProfile(user: User): Observable<User>;
    abstract getProfileById(profileId: string): Observable<User>;
}
