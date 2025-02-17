import { Profile } from './profile.entity';

export interface User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    token: string;
    verified: boolean;
    profile: Profile;
    idSocial: string;
}

