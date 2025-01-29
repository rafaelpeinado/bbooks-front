import { Book } from "../entities/book.entity";
import { UserBook } from "../entities/user-book.entity";

export interface UserBookDetails {
    userBook: UserBook;
    book: Book;
}
