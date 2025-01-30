import { UserBook } from "src/app/core/domain/entities/user-book.entity";
import { UserBookTO } from "../dtos/user-book.dto";
import { UserBookBuilder } from "src/app/core/domain/builders/user-book.builder";
import { BookBuilder } from "src/app/core/domain/builders/book.builder";
import { ApiType } from "src/app/core/domain/enums/api-type.enum";

export class UserBookMapper {
    static toEntity(userBookTO: UserBookTO): UserBook {
        return new UserBookBuilder()
            .setId(userBookTO.id)
            .setBook(
                new BookBuilder().copyFrom(userBookTO.book)
                    .setId(userBookTO.idBookGoogle ? userBookTO.idBookGoogle : userBookTO.idBook)
                    .setApi(userBookTO.idBookGoogle ? ApiType.GOOGLE : ApiType.BBOOKS)
                    .setNumberPage(userBookTO.page)
                    .build()
            )
            .setStatus(userBookTO.status)
            .setTags(userBookTO.tags)
            .setProfileId(userBookTO.profileId)
            .setAddDate(userBookTO.addDate)
            .setPage(userBookTO.page)
            .setFinishDate(userBookTO.finishDate)
            .build()
    }

    static toDTO(userBook: UserBook): UserBookTO {
        const userBookTO: UserBookTO = {
            profileId: userBook.profileId,
            status: userBook.status,
            tags: userBook.tags,
            page: userBook.page,
            idBookGoogle: userBook.book.api === ApiType.GOOGLE ? userBook.book.id : null,
            idBook: userBook.book.api !== ApiType.GOOGLE ? userBook.book.id : null,
            addDate: null,
            book: null,
            finishDate: null,
            id: null
        }
        return userBookTO;
    }
}