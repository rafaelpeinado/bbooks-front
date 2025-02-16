import { Book } from 'src/app/core/domain/entities/book.entity';
import { PaginationInterface } from '../../core/domain/interfaces/pagination.interface';
import { ListItemsGoogleBooks } from './google-books.dto';

export interface SearchMergedBookTO {
    books: PaginationInterface<Book>;
    googleBooks: ListItemsGoogleBooks;
    page: number;
    search: string;
}
