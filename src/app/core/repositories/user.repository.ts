import { Observable } from 'rxjs';
import { User } from '../domain/entities/user.entity';

export abstract class UserRepository {
    abstract getUserById(id: string): Observable<User>;
    abstract registerUser(user: Partial<User>): Observable<User>;
    abstract updateUserInfo(): Observable<User>;
}
