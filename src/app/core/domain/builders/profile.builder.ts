import { Profile } from '../entities/profile.entity';
import { BuilderImpl } from './builder.builder';

export class ProfileBuilder extends BuilderImpl<Profile, ProfileBuilder> {

    static builder() { return new this(); }

    setId(id: string): ProfileBuilder { return this.set('id', id); }
    setCountry(country: string): ProfileBuilder { return this.set('country', country); }
    setCity(city: string): ProfileBuilder { return this.set('city', city); }
    setState(state: string): ProfileBuilder { return this.set('state', state); }
    setBirthDate(birthDate: Date): ProfileBuilder { return this.set('birthDate', birthDate); }
    setProfileImage(profileImage: string): ProfileBuilder { return this.set('profileImage', profileImage); }
    setUsername(username: string): ProfileBuilder { return this.set('username', username); }
}
