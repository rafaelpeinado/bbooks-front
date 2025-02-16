import { Profile } from "./profile.entity";

export interface User {
    id: string,
    name: string,
    lastName: string,
    email: string,
    password: string,
    token: string,
    idToken: string,
    idSocial: string,
    verified: boolean,
    profile: Profile,
}

