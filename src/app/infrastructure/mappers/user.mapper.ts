import { User } from "src/app/core/domain/entities/user.entity";
import { UserTO } from "../dtos/user-dto";
import { UserBuilder } from "src/app/core/domain/builders/user.builder";

export class UserMapper {
    static toEntity(userTO: UserTO): User {
        const builder = UserBuilder.builder();

        if (userTO.id) builder.setId(userTO.id);
        if (userTO.email) builder.setEmail(userTO.email);
        if (userTO.token) builder.setToken(userTO.token);
        if (userTO.idSocial) builder.setIdSocial(userTO.idSocial);
        if (userTO.verified !== undefined) builder.setVerified(userTO.verified);

        if (userTO.profileTO) {
            builder
                .setProfile(userTO.profileTO)
                .setName(userTO.profileTO.name)
                .setLastName(userTO.profileTO.lastName);
        }

        return builder.build();
    }

    static toDTO(user: User): UserTO {
        const userTO: UserTO = undefined;
        return userTO;
    }
}