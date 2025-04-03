import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Login } from 'src/app/core/domain/entities/login.entity';
import { User } from 'src/app/core/domain/entities/user.entity';
import { AuthRepository } from 'src/app/core/repositories/auth.repository';
import { LoginTO } from 'src/app/core/use-cases/dtos/login.dto';
import { environment } from 'src/environments/environment';
import { LoginMapper } from '../mappers/login.mapper';
import { BaseApiService } from './base-service.service';
import { UserMapper } from '../mappers/user.mapper';
import { UserTO } from '../dtos/user.dto';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService extends BaseApiService<User, UserTO> implements AuthRepository {

    private readonly isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    private readonly api = environment.api + 'auth/';
    private readonly apiLogin = this.api + 'login/';
    private readonly apiLoginGoogle = this.apiLogin + 'google/';
    private readonly apiToken = this.apiLogin + 'token';
    private readonly apiResetPass = this.api + 'reset-pass/';
    private readonly apiConfirm = this.api + 'confirm/';

    constructor(protected readonly http: HttpClient) {
        super(http);
    }

    authConfirm(login: Login): Observable<User> {
        const service = this.http.post<UserTO>(this.apiConfirm, login);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    changePassword(login: Login): Observable<User> {
        const service = this.http.put<UserTO>(this.apiResetPass, login);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    sendEmailResetPassword(input: { email: string; url: string }): Observable<string> {
        return this.http.post<string>(this.api + 'reset-pass', input).pipe(first());
    }

    loginByGoogle(user: User): Observable<User> {
        const service = this.http.post<UserTO>(this.apiLoginGoogle, user);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    getUserByPasswordToken(token: string): Observable<User> {
        const service = this.http.get<UserTO>(this.apiResetPass + token);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    loginByToken(login: Login): Observable<User> {
        const loginTO: LoginTO = LoginMapper.toDTO(login);
        const service = this.http.post<UserTO>(this.apiToken, loginTO);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    getIsLogged(): BehaviorSubject<boolean> {
        return this.isLogged;
    }

    setIsLogged(isLogged: boolean): void {
        this.isLogged.next(isLogged);
    }

    logout(): Observable<void> {
        return of(undefined);
    }

    login(login: Login): Observable<User> {
        const loginTO: LoginTO = LoginMapper.toDTO(login);
        const service = this.http.post<UserTO>(this.api + 'login', loginTO);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }
}
