import { UserBook } from "./user-book.entity";

export class Bookcase {
    constructor(
        public id: string,
        public description: string,
        public userBooks: UserBook[],
    ) { }
}