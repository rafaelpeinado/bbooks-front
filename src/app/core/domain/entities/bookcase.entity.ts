import { UserBook } from "./user-book.entity";

export class Bookcase {
    constructor(
        public id: number,
        public description: string,
        public userBooks: UserBook[],
    ) { }
}