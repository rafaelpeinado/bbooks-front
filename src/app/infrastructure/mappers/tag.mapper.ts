import { Tag } from "src/app/core/domain/entities/tag.entity";
import { TagTO } from "../dtos/tag.dto";
import { TagBuilder } from "src/app/core/domain/builders/tag.builder";
import { UserBookMapper } from "./user-book.mapper";

export class TagMapper {
    static toEntity(tagTO: TagTO): Tag {
        return new TagBuilder()
            .setId(tagTO.id)
            .setName(tagTO.name)
            .setColor(tagTO.color)
            .setProfile(tagTO.profile)
            .setUserBooks(tagTO.books.map((book) => UserBookMapper.toEntity(book)))
            .build()
    }

    static toDTO(tag: Tag): TagTO {
        const tagTO: TagTO = {
            id: tag.id,
            color: tag.color,
            name: tag.name,
            profile: tag.profile,
            books: tag.userBooks.map((userBook) => UserBookMapper.toDTO(userBook)),
        }
        return tagTO;
    }
}
