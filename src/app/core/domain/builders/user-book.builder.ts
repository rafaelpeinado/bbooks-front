import { Book } from '../entities/book.entity';
import { Tag } from '../entities/tag.entity';
import { UserBook } from '../entities/user-book.entity';
import { BookStatus } from '../enums/book-status.enum';

export class UserBookBuilder {
    private _userBook: Partial<UserBook> = {};

    constructor() { }

    setId(id: string): UserBookBuilder {
        this._userBook.id = id;
        return this;
    }

    setProfileId(profileId: number): UserBookBuilder {
        this._userBook.profileId = profileId;
        return this;
    }

    setBook(book: Book): UserBookBuilder {
        this._userBook.book = book;
        return this;
    }

    setStatus(status: BookStatus): UserBookBuilder {
        this._userBook.status = status;
        return this;
    }

    setAddDate(addDate: Date): UserBookBuilder {
        this._userBook.addDate = addDate;
        return this;
    }

    setFinishDate(finishDate: Date | null): UserBookBuilder {
        this._userBook.finishDate = finishDate;
        return this;
    }

    setTags(tags: Tag[]): UserBookBuilder {
        this._userBook.tags = tags;
        return this;
    }

    setPage(page: number): UserBookBuilder {
        this._userBook.page = page;
        return this;
    }

    copyFrom(userBook: UserBook): UserBookBuilder {
        if (userBook) {
            Object.keys(userBook)
                .forEach((key) => this._userBook[key] = userBook[key]);
        }

        return this;
    }

    build(): UserBook {
        return this._userBook as UserBook;
    }
}
