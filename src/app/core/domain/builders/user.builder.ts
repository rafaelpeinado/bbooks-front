import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';
import { BuilderImpl } from './builder.builder';

export class UserBuilder extends BuilderImpl<User, UserBuilder> {
    static builder() { return new this(); }

    setId(id: string): UserBuilder { return this.set('id', id); }
    setName(name: string): UserBuilder { return this.set('name', name); }
    setLastName(lastName: string): UserBuilder { return this.set('lastName', lastName); }
    setEmail(email: string): UserBuilder { return this.set('email', email); }
    setPassword(password: string): UserBuilder { return this.set('password', password); }
    setToken(token: string): UserBuilder { return this.set('token', token); }
    setIdToken(idToken: string): UserBuilder { return this.set('idToken', idToken); }
    setIdSocial(idSocial: string): UserBuilder { return this.set('idSocial', idSocial); }
    setVerified(verified: boolean): UserBuilder { return this.set('verified', verified); }
    setProfile(profile: Profile): UserBuilder { return this.set('profile', profile); }
}
