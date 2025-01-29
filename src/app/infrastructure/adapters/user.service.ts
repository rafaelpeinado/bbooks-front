import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { User } from "src/app/core/domain/entities/user.entity";
import { UserRepository } from "src/app/core/repositories/user.repository";
import { RegisterUserOutputDto } from "src/app/core/use-cases/dtos/register-user.dto";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})

export class UserService extends UserRepository {

    private api: string = environment.api + 'users/';

    constructor(private http: HttpClient) {
        super();
    }

    registerUser(): Observable<User> {
        throw new Error("Method not implemented.");
    }

    getUserById(id: string): Observable<User> {
        return this.http.get<RegisterUserOutputDto>(`${this.api}${id}`).pipe(
            first(),
            map((response) => new User(
                response.id,
                response.profile.name,
                response.profile.lastName,
                response.profile.username,
                response.email,
                response.password,
                response.token,
                response.idToken,
                response.idSocial,
                response.verified,
                response.profile
            )),
        );
    }

}