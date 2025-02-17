import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserRepository } from "../../repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { UseCaseInterface } from "../use-case.interface";

@Injectable({
    providedIn: 'root',
})

export class GetUserByIdUseCase implements UseCaseInterface {
    constructor(private userRepository: UserRepository) { }

    execute(email: string): Observable<User> {
        return this.userRepository.getUserByEmail(email);
    }
}

