import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { UserBookTO } from '../dtos/user-book.dto';
import { UserBookBuilder } from 'src/app/core/domain/builders/user-book.builder';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';

export class UserBookMapper {
    static toEntity(userBookTO: UserBookTO): UserBook {
        const builder = UserBookBuilder.builder();

        if (userBookTO.id) builder.setId(userBookTO.id);
        if (userBookTO.status) builder.setStatus(userBookTO.status);
        if (userBookTO.tags) builder.setTags(userBookTO.tags);
        if (userBookTO.profileId) builder.setProfileId(userBookTO.profileId);
        if (userBookTO.addDate) builder.setAddDate(userBookTO.addDate);
        if (userBookTO.page !== undefined) builder.setPage(userBookTO.page);
        if (userBookTO.finishDate) builder.setFinishDate(userBookTO.finishDate);

        const idBook = userBookTO.idBookGoogle ?? userBookTO.idBook;
        const apiType = userBookTO.idBookGoogle ? ApiType.GOOGLE : ApiType.BBOOKS;

        const book = BookBuilder.builder()
            .copyFrom(userBookTO.book)
            .setId(idBook)
            .setApi(apiType)
            .setNumberPage(userBookTO.page)
            .build();

        builder.setBook(book);

        return builder.build();
    }

    static toDTO(userBook: UserBook): UserBookTO {
        const idBookGoogle = userBook.book.api === ApiType.GOOGLE ? userBook.book.id : null;
        const idBook = userBook.book.api !== ApiType.GOOGLE ? userBook.book.id : null;

        const userBookTO: UserBookTO = {
            profileId: userBook.profileId,
            status: userBook.status,
            tags: userBook.tags,
            page: userBook.page,
            idBookGoogle,
            idBook,
            addDate: null,
            book: null,
            finishDate: null,
            id: null
        };

        return userBookTO;
    }
}
