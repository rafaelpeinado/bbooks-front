import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Login } from "src/app/core/domain/entities/login.entity";
import { User } from "src/app/core/domain/entities/user.entity";
import { AuthRepository } from "src/app/core/repositories/auth.repository";
import { LoginTO } from "src/app/core/use-cases/dtos/login.dto";
import { environment } from "src/environments/environment";
import { LoginMapper } from "../mappers/login.mapper";
import { BaseApiService } from "./base-service.service";
import { UserMapper } from "../mappers/user.mapper";
import { UserTO } from "../dtos/user.dto";

@Injectable({
    providedIn: 'root'
})
export class AuthApiService extends BaseApiService<User, UserTO> implements AuthRepository {

    private isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    private api = environment.api + 'auth/';
    private apiLogin = this.api + 'login/';
    private apiToken = this.apiLogin + 'token';

    constructor(protected http: HttpClient) {
        super(http);
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
