import { UserBook } from "../core/domain/entities/user-book.entity";

export class BookCase {
    id: any;
    description: string;
    userBooks: UserBook[];
}
