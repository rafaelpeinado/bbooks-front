import { BookBuilder } from 'src/app/core/domain/builders/book.builder';
import { ItemGoogleBooks } from '../dtos/google-books.dto';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { ISBNGoogleEnum } from '../enums/isbn-google.enum';
import { Author } from 'src/app/core/domain/entities/author.entity';
import { Book } from 'src/app/core/domain/entities/book.entity';

export class GoogleBooksMapper {
    static toBook(googleBooks: ItemGoogleBooks): Book {
        return new BookBuilder()
            .setId(googleBooks.id)
            .setIsbn10(GoogleBooksMapper.getIsbn(googleBooks, ISBNGoogleEnum.ISBN_10))
            .setIsbn13(GoogleBooksMapper.getIsbn(googleBooks, ISBNGoogleEnum.ISBN_13))
            .setTitle(googleBooks.volumeInfo.title)
            .setAuthors(GoogleBooksMapper.getAuthors(googleBooks))
            .setNumberPage(googleBooks.volumeInfo.pageCount)
            .setLanguage(googleBooks.volumeInfo.language)
            .setPublisher(googleBooks.volumeInfo.publisher)
            .setPublishedDate(googleBooks.volumeInfo.publishedDate)
            // .setAverageRating(response.volumeInfo.a)
            .setImage(GoogleBooksMapper.getImage(googleBooks))
            .setDescription(googleBooks.volumeInfo.description)
            .setApi(ApiType.GOOGLE)
            .build();
    }

    private static getIsbn(response: ItemGoogleBooks, isbnGoogleEnum: ISBNGoogleEnum): string {
        return response.volumeInfo.industryIdentifiers?.find((item) => item.type === isbnGoogleEnum)?.identifier;
    }

    private static getAuthors(response: ItemGoogleBooks): Author[] {
        const authors: string[] = response.volumeInfo.authors;
        if (authors) {
            return authors.map((author) => new Author(undefined, author));
        }
    }

    private static getImage(response: ItemGoogleBooks): string {
        const links = response.volumeInfo.imageLinks;
        if (links) {
            const thumbnail = links.thumbnail;
            return thumbnail
                .slice(0, thumbnail.indexOf('zoom=1') + 'zoom=1'.length)
                .concat('&source=gbs_api')
                .replace('http', 'https');
        }
        return '';
    }
}
