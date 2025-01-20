import { BookBuilder } from "../builders/book.builder";
import { BookStatus } from "../enums/book-status.enum";
import { Author } from "./author.entity";
import { Tag } from "./tag.entity";

export class Book {
    public readonly id: string;
    public readonly isbn10: string;
    public readonly isbn13: string;
    public readonly title: string;
    public readonly authors: Author[];
    public readonly numberPage: number;
    public readonly language: string;
    public readonly publisher: string;
    // country: number;
    public readonly publishedDate: number;
    public readonly averageRating: number;
    public readonly image: string;
    public readonly description: string;
    public readonly status: BookStatus;
    public readonly idUserBook: number;
    public readonly tags: Tag[];
    public readonly api: string;
    public readonly finishDate: Date;


    constructor(builder: BookBuilder) {
        Object.assign(this, builder);
    }
}