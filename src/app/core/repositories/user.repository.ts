import { Observable } from 'rxjs';
import { User } from '../domain/entities/user.entity';

export abstract class UserRepository {
    abstract getUserById(id: string): Observable<User>;
    abstract updateUserInfo(): Observable<User>;
    abstract getUserByEmail(email: string): Observable<User>;
    abstract updateUser(user: User): Observable<User>;
    abstract getAllUsers(): Observable<User[]>;
    abstract getUsersByName(input: string): Observable<User[]>;
    abstract getUsersByUsername(input: string): Observable<User[]>;
    abstract getUserByUsername(username: string, userToken: string): Observable<User>;
}
