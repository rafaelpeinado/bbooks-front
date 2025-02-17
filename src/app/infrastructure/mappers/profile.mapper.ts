import { ProfileBuilder } from 'src/app/core/domain/builders/profile.builder';
import { Profile } from 'src/app/core/domain/entities/profile.entity';
import { Utils } from '../utils/utils';
import { ProfileTO } from '../dtos/user.dto';

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

    static toDTO(profile: Profile): ProfileTO {
        const profileTO: ProfileTO = undefined;
        return profileTO;
    }
}
