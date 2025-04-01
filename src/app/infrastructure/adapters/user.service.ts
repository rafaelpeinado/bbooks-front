import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/domain/entities/user.entity';
import { UserRepository } from 'src/app/core/repositories/user.repository';
import { environment } from 'src/environments/environment';
import { RegisterTO, UserTO } from '../dtos/user.dto';
import { BaseApiService } from './base-service.service';
import { UserMapper } from '../mappers/user.mapper';
import { first, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})

export class UserService extends BaseApiService<User, UserTO> implements UserRepository {

    private api: string = environment.api + 'users/';
    private apiGoogle: string = this.api + 'google/';
    private apiUsername: string = this.api + 'username/';

    constructor(protected readonly http: HttpClient) {
        super(http);
    }
    registerUser(user: User): Observable<User> {
        const registerTO: RegisterTO = {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            confirmPassword: user.password,
            idSocial: user.idSocial,
            profileImage: user.profile.profileImage,
            userName: user.profile.username,
        };
        const service = this.http.post<UserTO>(this.api, registerTO);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    getUserByUsername(username: string, userToken: string): Observable<User> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: userToken
            })
        };
        const service = this.http.get<UserTO>(this.apiUsername + username, httpOptions);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    getUsersByName(input: string): Observable<User[]> {
        return this.http.get<UserTO[]>(this.api).pipe(
            first(),
            map((usersTO) => usersTO.map((userTO) => UserMapper.toEntity(userTO))),
            map(users => {
                const normalizedSearch = this.normalizeString(input);
                return users.filter(user => this.normalizeString(`${user.name}${user.lastName}`).includes(normalizedSearch));
            }),
        );
    }

    getUsersByUsername(input: string): Observable<User[]> {
        return this.http.get<UserTO[]>(this.api).pipe(
            first(),
            map((usersTO) => usersTO.map((userTO) => UserMapper.toEntity(userTO))),
            map(users => {
                const normalizedSearch = this.normalizeString(input);
                return users.filter(user => this.normalizeString(user?.profile?.username).includes(normalizedSearch));
            }),
        );
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<UserTO[]>(this.api).pipe(
            first(),
            map((usersTO) => usersTO.map((userTO) => UserMapper.toEntity(userTO))),
        );
    }

    updateUser(user: User): Observable<User> {
        const userTO: UserTO = UserMapper.toDTO(user);
        const service = this.http.put<UserTO>(this.api + userTO.id, userTO);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    getUserByEmail(email: string): Observable<User> {
        const service = this.http.get<UserTO>(this.apiGoogle + email);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    updateUserInfo(): Observable<User> {
        const service = this.http.get<UserTO>(this.api + 'info/');
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    getUserById(id: string): Observable<User> {
        const service = this.http.get<UserTO>(this.api + id);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    private normalizeString(value: string = ''): string {
        return value.toLowerCase().replace(/\s/g, '');
    }
}
