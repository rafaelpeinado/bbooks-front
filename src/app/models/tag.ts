import { UserBookTO } from "../infrastructure/dtos/user-book.dto";

export class Tag {
    id: number;
    name: string;
    color: string;
    profile: any;
    books: UserBookTO[];
}
