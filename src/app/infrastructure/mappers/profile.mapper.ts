import { ProfileBuilder } from 'src/app/core/domain/builders/profile.builder';
import { Profile } from 'src/app/core/domain/entities/profile.entity';
import { Utils } from '../utils/utils';
import { ProfileTO } from '../dtos/user.dto';
import { User } from 'src/app/core/domain/entities/user.entity';

export class ProfileMapper {
    static toEntity(profileTO: ProfileTO): Profile {
        const builder = ProfileBuilder.builder();

        if (profileTO.id) { builder.setId(profileTO.id); }
        if (profileTO.country) { builder.setCountry(profileTO.country); }
        if (profileTO.city) { builder.setCity(profileTO.city); }
        if (profileTO.state) { builder.setState(profileTO.state); }
        if (profileTO.birthDate) { builder.setBirthDate(Utils.stringISOToDate(profileTO.birthDate)); }
        if (profileTO.profileImage) { builder.setProfileImage(profileTO.profileImage); }
        if (profileTO.username) { builder.setUsername(profileTO.username); }

        return builder.build();
    }

    static toDTO(user: User): ProfileTO {
        if (user) {
            let birthDate;
            if (user.profile?.birthDate instanceof Date) {
                birthDate = user.profile?.birthDate.toISOString()
            } else {
                birthDate = user.profile?.birthDate;
            }
            const profileTO: ProfileTO = {
                birthDate: birthDate,
                city: user.profile?.city,
                country: user.profile?.country,
                friendshipStatus: null,
                id: user.profile?.id,
                name: user.name,
                lastName: user.lastName,
                profileImage: user.profile?.profileImage,
                state: user.profile?.state,
                username: user.profile?.username,
            };
            return profileTO;
        }
        return null;
    }
}
