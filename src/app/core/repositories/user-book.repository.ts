import { Observable } from "rxjs";
import { UserBook } from "../domain/entities/user-book.entity";


export abstract class UserBookRepository {
    abstract getUserBookById(id: string): Observable<UserBook>;
    abstract getAllUserBooksByProfileId(profileId: string): Observable<UserBook[]>;
}