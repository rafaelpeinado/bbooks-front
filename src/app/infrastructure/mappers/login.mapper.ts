import { LoginBuilder } from "src/app/core/domain/builders/login.builder";
import { Login } from "src/app/core/domain/entities/login.entity";
import { LoginTO } from "src/app/core/use-cases/dtos/login.dto";

export class LoginMapper {

    static toEntity(loginTO: LoginTO): Login {
        const builder = LoginBuilder.builder();

        if (loginTO.email) { builder.setEmail(loginTO.email); }
        if (loginTO.password) { builder.setPassword(loginTO.password); }
        builder.setKeepLogin(true);

        return builder.build();
    }

    static toDTO(login: Login): LoginTO {
        const loginTO: LoginTO = {
            email: login.email,
            password: login.password,
            keepLogin: login.keepLogin,
        };

        return loginTO;
    }
}