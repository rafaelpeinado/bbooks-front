import { Author } from "../entities/author.entity";
import { Book } from "../entities/book.entity";
import { Tag } from "../entities/tag.entity";
import { BookStatus } from "../enums/book-status.enum";

export class BookBuilder {
    private _id!: string;
    private _isbn10!: string;
    private _isbn13!: string;
    private _title!: string;
    private _authors!: Author[];
    private _numberPage!: number;
    private _language: string;
    private _publisher: string;
    // country: number;
    private _publishedDate: number;
    private _averageRating: number;
    private _image?: string;
    private _description: string;
    private _status: BookStatus;
    private _idUserBook: number;
    private _tags: Tag[];
    private _api: string;
    private _finishDate: Date;

    constructor(init?: Partial<BookBuilder>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    get id(): string {
        return this._id!;
    }

    setId(id: string): BookBuilder {
        if (!id || id.trim() === "") {
            throw new Error("ID is required.");
        }
        this._id = id;
        return this;
    }

    setIsbn10(isbn10: string): BookBuilder {
        if (isbn10 && isbn10.length !== 10) {
            throw new Error("ISBN-10 must be exactly 10 characters.");
        }
        this._isbn10 = isbn10;
        return this;
    }

    setIsbn13(isbn13: string): BookBuilder {
        if (isbn13 && isbn13.length !== 13) {
            throw new Error("ISBN-13 must be exactly 13 characters.");
        }
        this._isbn13 = isbn13;
        return this;
    }

    setTitle(title: string): BookBuilder {
        if (!title || title.trim() === "") {
            throw new Error("Title is required.");
        }
        this._title = title;
        return this;
    }

    setAuthors(authors: Author[]): BookBuilder {
        if (!authors || authors.length === 0) {
            throw new Error("Author is required.");
        }
        this._authors = authors;
        return this;
    }

    setNumberPage(numberPage: number): BookBuilder {
        this._numberPage = numberPage;
        return this;
    }

    setLanguage(language: string): BookBuilder {
        this._language = language;
        return this;
    }

    setPublisher(publisher: string): BookBuilder {
        this._publisher = publisher;
        return this;
    }

    setPublishedDate(publishedDate: number): BookBuilder {
        this._publishedDate = publishedDate;
        return this;
    }

    setAverageRating(averageRating: number): BookBuilder {
        this._averageRating = averageRating;
        return this;
    }

    setImage(image: string): BookBuilder {
        this._image = image;
        return this;
    }

    setDescription(description: string): BookBuilder {
        this._description = description;
        return this;
    }

    setStatus(status: BookStatus): BookBuilder {
        this._status = status;
        return this;
    }

    setIdUserBook(idUserBook: number): BookBuilder {
        this._idUserBook = idUserBook;
        return this;
    }

    setTags(tags: Tag[]): BookBuilder {
        this._tags = tags;
        return this;
    }

    setApi(api: string): BookBuilder {
        this._api = api;
        return this;
    }

    setFinishDate(finishDate: Date): BookBuilder {
        this._finishDate = finishDate;
        return this;
    }

    copy(): BookBuilder {
        return new BookBuilder(this);
    }

    build(): Book {
        return new Book(this);
    }
}