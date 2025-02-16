import { Author } from '../entities/author.entity';
import { Book } from '../entities/book.entity';
import { ApiType } from '../enums/api-type.enum';
import { BuilderImpl } from './builder.builder';

export class BookBuilder extends BuilderImpl<Book, BookBuilder> {

    static builder() { return new this(); }

    setId(id: string): BookBuilder { return this.set('id', id); }
    setIsbn10(isbn10: string): BookBuilder { return this.set('isbn10', isbn10); }
    setIsbn13(isbn13: string): BookBuilder { return this.set('isbn13', isbn13); }
    setTitle(title: string): BookBuilder { return this.set('title', title); }
    setAuthors(authors: Author[]): BookBuilder { return this.set('authors', authors); }
    setNumberPage(numberPage: number): BookBuilder { return this.set('numberPage', numberPage); }
    setLanguage(language: string): BookBuilder { return this.set('language', language); }
    setPublisher(publisher: string): BookBuilder { return this.set('publisher', publisher); }
    setPublishedDate(publishedDate: string): BookBuilder { return this.set('publishedDate', publishedDate); }
    setAverageRating(averageRating: number): BookBuilder { return this.set('averageRating', averageRating); }
    setImage(image: string): BookBuilder { return this.set('image', image); }
    setDescription(description: string): BookBuilder { return this.set('description', description); }
    setApi(api: ApiType): BookBuilder { return this.set('api', api); }
}
