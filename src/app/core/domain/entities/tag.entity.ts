import { Profile } from "./profile.entity";

export class Tag {
    constructor(
        public id: number,
        public name: string,
        public color: string,
        public profile: Profile,
        //public books: UserBookTO[],
    ) { }
}