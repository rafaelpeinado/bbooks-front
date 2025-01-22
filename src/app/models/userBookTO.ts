import { Book } from '../core/domain/entities/book.entity';
import { BookStatus } from './enums/BookStatus.enum';

import { Tag } from './tag';

export class UserBookTO {
    id: number;
    idBookGoogle: string;
    status: BookStatus;
    addDate: Date;
    idBook: number;
    tags: Tag[];
    page: number;
    profileId: number;
    book: Book;
    finishDate: Date;
}
