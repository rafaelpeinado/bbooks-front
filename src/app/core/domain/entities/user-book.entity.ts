import { UserBookBuilder } from "../builders/user-book.builder";
import { BookStatus } from "../enums/book-status.enum";
import { Book } from "./book.entity";
import { Tag } from "./tag.entity";

export class UserBook {
    public readonly id: string;
    public readonly profileId: number;
    public readonly book: Book;
    public readonly status: BookStatus;
    public readonly addDate: Date;
    public readonly finishDate: Date | null;
    public readonly tags: Tag[];
    public readonly page: number;

    constructor(builder: UserBookBuilder) {
        this.id = builder.id;
        this.profileId = builder.profileId;
        this.book = builder.book;
        this.status = builder.status;
        this.addDate = builder.addDate;
        this.finishDate = builder.finishDate;
        this.tags = builder.tags;
        this.page = builder.page;
    }
}
