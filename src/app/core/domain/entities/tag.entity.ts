import { TagBuilder } from "../builders/tag.builder";
import { Profile } from "./profile.entity";
import { UserBook } from "./user-book.entity";

export class Tag {
    public readonly id: string;
    public readonly name: string;
    public readonly color: string;
    public readonly profile: Profile;
    public readonly userBooks: UserBook[];

    constructor(builder: TagBuilder) {
        this.id = builder.id;
        this.name = builder.name;
        this.color = builder.color;
        this.profile = builder.profile;
        this.userBooks = builder.userBooks;
    }
}