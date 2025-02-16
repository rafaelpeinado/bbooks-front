import { Book } from 'src/app/core/domain/entities/book.entity';
import { Tag } from 'src/app/core/domain/entities/tag.entity';
import { BookStatus } from 'src/app/core/domain/enums/book-status.enum';

export class UserBookTO {
    id: string;
    idBookGoogle: string;
    status: BookStatus;
    addDate: Date;
    idBook: string;
    tags: Tag[];
    page: number;
    profileId: number;
    book: Book;
    finishDate: Date;
}


export interface AllUserBookByProfileIdTO {
    profileId: number;
    books: UserBookTO[];
}

export interface UserBookUpdateStatusTO {
    id: string,
    status: string,
}


