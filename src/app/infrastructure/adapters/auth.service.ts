import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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
    private api = environment.api + 'auth/';

    constructor(protected http: HttpClient) {
        super(http);
    }

    login(login: Login): Observable<User> {
        const loginTO: LoginTO = LoginMapper.toDTO(login);
        const service = this.http.post<UserTO>(this.api + 'login', loginTO);
        return this.handleRequestDTOToEntity(service, UserMapper.toEntity);
    }
}
