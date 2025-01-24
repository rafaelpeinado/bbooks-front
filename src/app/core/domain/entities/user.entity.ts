import { Profile } from "./profile.entity";

export class User {
    constructor(
        public id: string,
        public name: string,
        public lastName: string,
        public username: string,
        public email: string,
        public password: string,
        public token: string,
        public idToken: string,
        public idSocial: string,
        public verified: boolean,
        public profile: Profile,
    ) { }
}
