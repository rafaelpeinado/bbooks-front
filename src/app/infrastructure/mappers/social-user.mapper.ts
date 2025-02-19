import { User } from 'src/app/core/domain/entities/user.entity';
import { UserBuilder } from 'src/app/core/domain/builders/user.builder';
import { SocialUser } from 'angularx-social-login';
import { ProfileBuilder } from 'src/app/core/domain/builders/profile.builder';

export class SocialUserMapper {
    static toEntity(socialUser: SocialUser): User {
        const builder = UserBuilder.builder();

        if (socialUser.firstName) { builder.setName(socialUser.firstName); }
        if (socialUser.lastName) { builder.setLastName(socialUser.lastName); }
        if (socialUser.email) { builder.setEmail(socialUser.email); }
        if (socialUser.id) { builder.setIdSocial(socialUser.id); }

        const builderProfile = ProfileBuilder.builder();
        if (socialUser.photoUrl) { builderProfile.setProfileImage(socialUser.photoUrl); }
        builder.setProfile(builderProfile.build());

        return builder.build();
    }
}
