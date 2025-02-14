import { Observable } from 'rxjs';
import { UserBook } from '../domain/entities/user-book.entity';
import { ApiType } from '../domain/enums/api-type.enum';
import { GeneralStatus } from '../domain/entities/general-status.entity';
import { UserBookUpdateStatusTO } from 'src/app/infrastructure/dtos/user-book.dto';

export abstract class UserBookRepository {
    abstract getUserBookById(id: string): Observable<UserBook>;
    abstract getAllUserBooksByProfileId(profileId: string): Observable<UserBook[]>;
    abstract createUserBook(userBook: UserBook): Observable<UserBook>;
    abstract updateUserBook(userBook: UserBook): Observable<UserBook>;
    abstract getGeneralStatusBooks(id: string, apiType: ApiType): Observable<GeneralStatus>;
    abstract getAllUserBookTimelineByProfileId(profileId: string): Observable<UserBook[]>;
    abstract changeStatusUserBook(userBookUpdateStatusTO: UserBookUpdateStatusTO): Observable<UserBook>;
}
