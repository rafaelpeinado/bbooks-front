import { BookStatus } from '../enums/book-status.enum';
import { Book } from './book.entity';
import { Tag } from './tag.entity';

export interface UserBook {
    id: string;
    profileId: number;
    book: Book;
    status: BookStatus;
    addDate: Date;
    finishDate: Date | null;
    tags: Tag[];
    page: number;
}
