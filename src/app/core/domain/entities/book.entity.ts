import { ApiType } from '../enums/api-type.enum';
import { Author } from './author.entity';

export interface Book {
    id: string;
    isbn10: string;
    isbn13: string;
    title: string;
    authors: Author[];
    numberPage: number;
    language: string;
    publisher: string;
    // country: number;
    publishedDate: string;
    averageRating: number;
    image: string;
    description: string;
    api: ApiType;
}
