import { Observable } from "rxjs";
import { Tag } from "../domain/entities/tag.entity";

export abstract class TagRepository {
    abstract addTag(tag: Tag): Observable<Tag>;
    abstract editTag(tag: Tag): Observable<Tag>;
    abstract getTagById(id: string): Observable<Tag>;
    abstract deleteTag(id: string): Observable<null>;
    abstract getAllTagsByProfileId(profileId: string): Observable<Tag[]>;
    abstract getAllTagsByUserBookId(userBookId: string): Observable<Tag[]>;
}