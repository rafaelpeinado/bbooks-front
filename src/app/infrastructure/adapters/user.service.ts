import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/core/domain/entities/user.entity";
import { UserRepository } from "src/app/core/repositories/user.repository";
import { environment } from "src/environments/environment";
import { UserTO } from "../dtos/user-dto";
import { BaseApiService } from "./base-service.service";
import { UserMapper } from "../mappers/user.mapper";

@Injectable({
    providedIn: 'root',
})

export class UserService extends BaseApiService<User, UserTO> implements UserRepository {

    private api: string = environment.api + 'users/';

    constructor(protected http: HttpClient) {
        super(http);
    }

    updateUserInfo(): Observable<User> {
        const service = this.http.get<UserTO>(this.api + 'info/');
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }

    registerUser(): Observable<User> {
        throw new Error("Method not implemented.");
    }

    getUserById(id: string): Observable<User> {
        throw new Error("Method not implemented.");
    }

}