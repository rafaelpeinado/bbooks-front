import { BookBuilder } from "../builders/book.builder";
import { ApiType } from "../enums/api-type.enum";
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
    public readonly publishedDate: string;
    public readonly averageRating: number;
    public readonly image: string;
    public readonly description: string;
    public readonly api: ApiType;

    constructor(builder: BookBuilder) {
        this.id = builder.id;
        this.isbn10 = builder.isbn10;
        this.isbn13 = builder.isbn13;
        this.title = builder.title;
        this.authors = builder.authors;
        this.numberPage = builder.numberPage;
        this.language = builder.language;
        this.publisher = builder.publisher;
        this.publishedDate = builder.publishedDate;
        this.averageRating = builder.averageRating;
        this.image = builder.image;
        this.description = builder.description;
        this.api = builder.api;
        // Object.assign(this, builder);
    }
}