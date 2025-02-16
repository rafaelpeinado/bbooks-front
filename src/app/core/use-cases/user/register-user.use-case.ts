import { Injectable } from "@angular/core";
import { UseCaseInterface } from "../use-case.interface";
import { UserRepository } from "../../repositories/user.repository";

@Injectable({
    providedIn: 'root',
})

export class RegisterUserUseCase implements UseCaseInterface {
    constructor(private userRepository: UserRepository) { }
    
    execute(input: any) {
        throw new Error("Method not implemented.");
    }

}
