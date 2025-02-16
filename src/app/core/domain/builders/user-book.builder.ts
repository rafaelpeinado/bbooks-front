import { Book } from '../entities/book.entity';
import { Tag } from '../entities/tag.entity';
import { UserBook } from '../entities/user-book.entity';
import { BookStatus } from '../enums/book-status.enum';
import { BuilderImpl } from './builder.builder';

export class UserBookBuilder extends BuilderImpl<UserBook, UserBookBuilder> {

    static builder() {
        return new this();
    }
    
    setId(id: string): UserBookBuilder {
        return this.set('id', id);
    }

    setProfileId(profileId: number): UserBookBuilder {
        return this.set('profileId', profileId);
    }

    setBook(book: Book): UserBookBuilder {
        return this.set('book', book);
    }

    setStatus(status: BookStatus): UserBookBuilder {
        return this.set('status', status);
    }

    setAddDate(addDate: Date): UserBookBuilder {
        return this.set('addDate', addDate);
    }

    setFinishDate(finishDate: Date | null): UserBookBuilder {
        return this.set('finishDate', finishDate);
    }

    setTags(tags: Tag[]): UserBookBuilder {
        return this.set('tags', tags);
    }

    setPage(page: number): UserBookBuilder {
        return this.set('page', page);
    }
}
