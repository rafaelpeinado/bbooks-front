import { Author } from '../entities/author.entity';
import { Book } from '../entities/book.entity';
import { ApiType } from '../enums/api-type.enum';

export class BookBuilder {
    private _book: Partial<Book> = {};

    constructor() { }

    setId(id: string): BookBuilder {
        // if (!id || id.trim() === "") {
        //     throw new Error("ID is required.");
        // }
        this._book.id = id;
        return this;
    }

    setIsbn10(isbn10: string): BookBuilder {
        this._book.isbn10 = isbn10;
        return this;
    }

    setIsbn13(isbn13: string): BookBuilder {
        this._book.isbn13 = isbn13;
        return this;
    }

    setTitle(title: string): BookBuilder {
        this._book.title = title;
        return this;
    }

    setAuthors(authors: Author[]): BookBuilder {
        this._book.authors = authors;
        return this;
    }

    setNumberPage(numberPage: number): BookBuilder {
        this._book.numberPage = numberPage;
        return this;
    }

    setLanguage(language: string): BookBuilder {
        this._book.language = language;
        return this;
    }

    setPublisher(publisher: string): BookBuilder {
        this._book.publisher = publisher;
        return this;
    }

    setPublishedDate(publishedDate: string): BookBuilder {
        this._book.publishedDate = publishedDate;
        return this;
    }

    setAverageRating(averageRating: number): BookBuilder {
        this._book.averageRating = averageRating;
        return this;
    }

    setImage(image: string): BookBuilder {
        this._book.image = image;
        return this;
    }

    setDescription(description: string): BookBuilder {
        this._book.description = description;
        return this;
    }

    setApi(api: ApiType): BookBuilder {
        // if (!api || api.trim() === "") {
        //     throw new Error("Api type is required.");
        // }
        this._book.api = api;
        return this;
    }

    copyFrom(book: Book): BookBuilder {
        if (book) {
            Object.keys(book)
                .forEach((key) => this._book[key] = book[key]);
        }
        // Object.assign(this, book);
        return this;
    }


    build(): Book {
        return this._book as Book;
    }
}
