import { User } from 'src/app/core/domain/entities/user.entity';
import { UserTO } from '../dtos/user-dto';
import { UserBuilder } from 'src/app/core/domain/builders/user.builder';
import { ProfileMapper } from './profile.mapper';

export class UserMapper {
    static toEntity(userTO: UserTO): User {
        const builder = UserBuilder.builder();

        if (userTO.id) { builder.setId(userTO.id); }
        if (userTO.email) { builder.setEmail(userTO.email); }
        if (userTO.token) { builder.setToken(userTO.token); }
        if (userTO.idSocial) { builder.setIdSocial(userTO.idSocial); }
        if (userTO.verified !== undefined) { builder.setVerified(userTO.verified); }

        if (userTO.profile) {
            builder
                .setProfile(ProfileMapper.toEntity(userTO.profile))
                .setName(userTO.profile.name)
                .setLastName(userTO.profile.lastName);
        }

        return builder.build();
    }

    static toDTO(user: User): UserTO {
        const userTO: UserTO = undefined;
        return userTO;
    }
}
