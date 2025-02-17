import { Observable } from "rxjs";
import { Login } from "../domain/entities/login.entity";
import { User } from "../domain/entities/user.entity";

export abstract class AuthRepository {
    abstract login(login: Login): Observable<User>;
}