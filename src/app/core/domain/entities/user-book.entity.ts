import { BookStatus } from '../enums/book-status.enum';
import { Book } from './book.entity';
import { Tag } from './tag.entity';

export interface UserBook {
    id: string;
    profileId: string;
    book: Book;
    status: BookStatus;
    addDate: Date;
    finishDate: Date | null;
    tags: Tag[];
    page: number;
}
