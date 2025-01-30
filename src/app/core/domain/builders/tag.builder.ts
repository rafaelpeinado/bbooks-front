import { Profile } from "../entities/profile.entity";
import { Tag } from "../entities/tag.entity";
import { UserBook } from "../entities/user-book.entity";

export class TagBuilder {
    private _tag: Partial<Tag> = {};

    constructor() { }

    setId(id: string): TagBuilder {
        this._tag.id = id;
        return this;
    }

    setName(name: string): TagBuilder {
        this._tag.name = name;
        return this;
    }

    setColor(color: string): TagBuilder {
        this._tag.color = color;
        return this;
    }

    setProfile(profile: Profile): TagBuilder {
        this._tag.profile = profile;
        return this;
    }

    setUserBooks(userBooks: UserBook[]): TagBuilder {
        this._tag.userBooks = userBooks;
        return this;
    }

    copyFrom(tag: Tag): TagBuilder {
        if (tag) {
            Object.keys(tag)
                .forEach((key) => this._tag[key] = tag[key])
        }
        return this;
    }

    build(): Tag {
        return this._tag as Tag;
    }
}