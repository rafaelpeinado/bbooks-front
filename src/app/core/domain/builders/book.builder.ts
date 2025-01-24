import { Author } from "../entities/author.entity";
import { Book } from "../entities/book.entity";
import { Tag } from "../entities/tag.entity";
import { ApiType } from "../enums/api-type.enum";
import { BookStatus } from "../enums/book-status.enum";

export class BookBuilder {
    private _id!: string;
    private _isbn10: string;
    private _isbn13: string;
    private _title: string;
    private _authors: Author[];
    private _numberPage: number;
    private _language: string;
    private _publisher: string;
    // country: number;
    private _publishedDate: string;
    private _averageRating: number;
    private _image?: string;
    private _description: string;
    private _status: BookStatus;
    private _idUserBook: number;
    private _tags: Tag[];
    private _api!: ApiType;
    private _finishDate: Date;

    constructor(init?: Partial<BookBuilder>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    get id(): string {
        return this._id;
    }

    get isbn10(): string {
        return this._isbn10;
    }

    get isbn13(): string {
        return this._isbn13;
    }

    get title(): string {
        return this._title;
    }

    get authors(): Author[] {
        return this._authors;
    }

    get numberPage(): number {
        return this._numberPage;
    }

    get language(): string {
        return this._language;
    }

    get publisher(): string {
        return this._publisher;
    }

    get publishedDate(): string {
        return this._publishedDate;
    }

    get averageRating(): number {
        return this._averageRating;
    }

    get image(): string | undefined {
        return this._image;
    }

    get description(): string {
        return this._description;
    }

    get status(): BookStatus {
        return this._status;
    }

    get idUserBook(): number {
        return this._idUserBook;
    }

    get tags(): Tag[] {
        return this._tags;
    }

    get api(): ApiType {
        return this._api;
    }

    get finishDate(): Date {
        return this._finishDate;
    }

    setId(id: string): BookBuilder {
        if (!id || id.trim() === "") {
            throw new Error("ID is required.");
        }
        this._id = id;
        return this;
    }

    setIsbn10(isbn10: string): BookBuilder {
        this._isbn10 = isbn10;
        return this;
    }

    setIsbn13(isbn13: string): BookBuilder {
        this._isbn13 = isbn13;
        return this;
    }

    setTitle(title: string): BookBuilder {
        this._title = title;
        return this;
    }

    setAuthors(authors: Author[]): BookBuilder {
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

    setPublishedDate(publishedDate: string): BookBuilder {
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

    setApi(api: ApiType): BookBuilder {
        if (!api || api.trim() === "") {
            throw new Error("Api type is required.");
        }
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

    copyFrom(book: Book): BookBuilder {
        this._id = book.id;
        this._isbn10 = book.isbn10;
        this._isbn13 = book.isbn13;
        this._title = book.title;
        this._authors = book.authors;
        this._numberPage = book.numberPage;
        this._language = book.language;
        this._publisher = book.publisher;
        this._publishedDate = book.publishedDate;
        this._averageRating = book.averageRating;
        this._image = book.image;
        this._description = book.description;
        this._status = book.status;
        this._idUserBook = book.idUserBook;
        this._tags = book.tags;
        this._api = book.api;
        this._finishDate = book.finishDate;
        // Object.assign(this, book);
        return this;
    }


    build(): Book {
        return new Book(this);
    }
}