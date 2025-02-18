import { User } from 'src/app/core/domain/entities/user.entity';
import { ProfileTO, UserTO } from '../dtos/user.dto';
import { UserBuilder } from 'src/app/core/domain/builders/user.builder';
import { ProfileMapper } from './profile.mapper';

export class UserMapper {
    static toEntity(userTO: UserTO): User {
        const builder = UserBuilder.builder();

        if (userTO.id) { builder.setId(userTO.id); }
        if (userTO.email) { builder.setEmail(userTO.email); }
        if (userTO.token) { builder.setToken(userTO.token); }
        if (userTO.verified) { builder.setVerified(userTO.verified); }
        if (userTO.idSocial) { builder.setIdSocial(userTO.idSocial); }

        if (userTO.profile) {
            builder
                .setProfile(ProfileMapper.toEntity(userTO.profile))
                .setName(userTO.profile.name)
                .setLastName(userTO.profile.lastName);
        }

        return builder.build();
    }

    static toDTO(user: User): UserTO {
        if (user) {
            const profileTO: ProfileTO = ProfileMapper.toDTO(user);
            const userTO: UserTO = {
                id: user.id,
                email: user.email,
                idSocial: user.idSocial,
                profile: profileTO,
                publicProfile: null,
                token: user.token,
                userName: user.profile?.username,
                verified: user.verified,
            }
            
            return userTO;
        }
        return null;
    }
}
