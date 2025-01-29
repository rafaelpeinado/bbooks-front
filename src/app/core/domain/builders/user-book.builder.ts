import { Book } from "../entities/book.entity";
import { Tag } from "../entities/tag.entity";
import { UserBook } from "../entities/user-book.entity";
import { BookStatus } from "../enums/book-status.enum";

export class UserBookBuilder {
    private _id: string;
    private _profileId: number;
    private _book: Book;
    private _status: BookStatus;
    private _addDate: Date;
    private _finishDate: Date | null;
    private _tags: Tag[];
    private _page: number;

    constructor(init?: Partial<UserBookBuilder>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    get id(): string {
        return this._id;
    }

    get profileId(): number {
        return this._profileId;
    }

    get book(): Book {
        return this._book;
    }

    get status(): BookStatus {
        return this._status;
    }

    get addDate(): Date {
        return this._addDate;
    }

    get finishDate(): Date | null {
        return this._finishDate;
    }

    get tags(): Tag[] {
        return this._tags;
    }

    get page(): number {
        return this._page;
    }

    setId(id: string): UserBookBuilder {
        this._id = id;
        return this;
    }

    setProfileId(profileId: number): UserBookBuilder {
        this._profileId = profileId;
        return this;
    }

    setBook(book: Book): UserBookBuilder {
        this._book = book;
        return this;
    }

    setStatus(status: BookStatus): UserBookBuilder {
        this._status = status;
        return this;
    }

    setAddDate(addDate: Date): UserBookBuilder {
        this._addDate = addDate;
        return this;
    }

    setFinishDate(finishDate: Date | null): UserBookBuilder {
        this._finishDate = finishDate;
        return this;
    }

    setTags(tags: Tag[]): UserBookBuilder {
        this._tags = tags;
        return this;
    }

    setPage(page: number): UserBookBuilder {
        this._page = page;
        return this;
    }

    copy(): UserBookBuilder {
        return new UserBookBuilder(this);
    }

    copyFrom(userBook: UserBook): UserBookBuilder {
        this._id = userBook.id;
        this._profileId = userBook.profileId;
        this._book = userBook.book;
        this._status = userBook.status;
        this._addDate = userBook.addDate;
        this._finishDate = userBook.finishDate;
        this._tags = userBook.tags;
        this._page = userBook.page;

        return this;
    }

    build(): UserBook {
        return new UserBook(this);
    }
}