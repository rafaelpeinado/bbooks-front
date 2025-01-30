import { Profile } from "../entities/profile.entity";
import { Tag } from "../entities/tag.entity";
import { UserBook } from "../entities/user-book.entity";

export class TagBuilder {
    private _id: string;
    private _name: string;
    private _color: string;
    private _profile: Profile;
    private _userBooks: UserBook[];

    constructor(init?: Partial<TagBuilder>) {
        if (init) {
            Object.assign(this, init);
        }
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get color(): string {
        return this._color;
    }

    get profile(): Profile {
        return this._profile;
    }

    get userBooks(): UserBook[] {
        return this._userBooks;
    }

    setId(id: string): TagBuilder {
        this._id = id;
        return this;
    }

    setName(name: string): TagBuilder {
        this._name = name;
        return this;
    }

    setColor(color: string): TagBuilder {
        this._color = color;
        return this;
    }

    setProfile(profile: Profile): TagBuilder {
        this._profile = profile;
        return this;
    }

    setUserBooks(userBooks: UserBook[]): TagBuilder {
        this._userBooks = userBooks;
        return this;
    }

    copy(): TagBuilder {
        return new TagBuilder(this);
    }

    copyFrom(tag: Tag): TagBuilder {
        if (tag) {
            this._id = tag.id;
            this._name = tag.name;
            this._color = tag.color;
            this._profile = tag.profile;
            this._userBooks = tag.userBooks;
        }
        return this;
    }


    build(): Tag {
        return new Tag(this);
    }
}