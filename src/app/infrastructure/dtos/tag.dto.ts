import { UserBookTO } from './user-book.dto';

export class TagTO {
    id: string;
    name: string;
    color: string;
    profile: any;
    books: UserBookTO[];
}
