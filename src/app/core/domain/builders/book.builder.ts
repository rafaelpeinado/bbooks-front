import { Author } from "../entities/author.entity";
import { Book } from "../entities/book.entity";
import { Tag } from "../entities/tag.entity";
import { BookStatus } from "../enums/book-status.enum";

export class BookBuilder {
    public id!: string;
    public isbn10!: string;
    public isbn13!: string;
    public title!: string;
    public authors!: Author[];
    public numberPage!: number;
    public language: string;
    public publisher: string;
    // country: number;
    public publishedDate: string;
    public averageRating: number;
    public image?: string;
    public description: string;
    public status: BookStatus;
    public idUserBook: number;
    public tags: Tag[];
    public api: string;
    public finishDate: Date;

    constructor(init?: Partial<BookBuilder>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    setId(id: string): BookBuilder {
        if (!id || id.trim() === "") {
            throw new Error("ID is required.");
        }
        this.id = id;
        return this;
    }

    setIsbn10(isbn10: string): BookBuilder {
        if (isbn10 && isbn10.length !== 10) {
            throw new Error("ISBN-10 must be exactly 10 characters.");
        }
        this.isbn10 = isbn10;
        return this;
    }

    setIsbn13(isbn13: string): BookBuilder {
        if (isbn13 && isbn13.length !== 13) {
            throw new Error("ISBN-13 must be exactly 13 characters.");
        }
        this.isbn13 = isbn13;
        return this;
    }

    setTitle(title: string): BookBuilder {
        if (!title || title.trim() === "") {
            throw new Error("Title is required.");
        }
        this.title = title;
        return this;
    }

    setAuthors(authors: Author[]): BookBuilder {
        if (!authors || authors.length === 0) {
            throw new Error("Author is required.");
        }
        this.authors = authors;
        return this;
    }

    setNumberPage(numberPage: number): BookBuilder {
        this.numberPage = numberPage;
        return this;
    }

    setLanguage(language: string): BookBuilder {
        this.language = language;
        return this;
    }

    setPublisher(publisher: string): BookBuilder {
        this.publisher = publisher;
        return this;
    }

    setPublishedDate(publishedDate: string): BookBuilder {
        this.publishedDate = publishedDate;
        return this;
    }

    setAverageRating(averageRating: number): BookBuilder {
        this.averageRating = averageRating;
        return this;
    }

    setImage(image: string): BookBuilder {
        this.image = image;
        return this;
    }

    setDescription(description: string): BookBuilder {
        this.description = description;
        return this;
    }

    setStatus(status: BookStatus): BookBuilder {
        this.status = status;
        return this;
    }

    setIdUserBook(idUserBook: number): BookBuilder {
        this.idUserBook = idUserBook;
        return this;
    }

    setTags(tags: Tag[]): BookBuilder {
        this.tags = tags;
        return this;
    }

    setApi(api: string): BookBuilder {
        this.api = api;
        return this;
    }

    setFinishDate(finishDate: Date): BookBuilder {
        this.finishDate = finishDate;
        return this;
    }

    copy(): BookBuilder {
        return new BookBuilder(this);
    }

    copyFrom(book: Book): BookBuilder {
        Object.assign(this, book);
        return this;
    }


    build(): Book {
        return new Book(this);
    }
}