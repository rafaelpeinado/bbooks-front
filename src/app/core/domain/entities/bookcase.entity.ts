import { Book } from "./book.entity";

export class Bookcase {
    constructor(
        public id: number,
        public description: string,
        public books: Book[],
    ) { }
}