export class Profile {
    constructor(
        public id: number,
        public name: string,
        public lastName: string,
        public country: string,
        public city: string,
        public state: string,
        public birthDate: string,
        public profileImage: string,
        public friendshipStatus: string,
        public username: string,
    ) { }
}