import { Profile } from '../entities/profile.entity';
import { Tag } from '../entities/tag.entity';
import { UserBook } from '../entities/user-book.entity';
import { BuilderImpl } from './builder.builder';

export class TagBuilder extends BuilderImpl<Tag, TagBuilder> {

    static builder() {
        return new this();
    }

    setId(id: string): TagBuilder {
        return this.set('id', id);
    }

    setName(name: string): TagBuilder {
        return this.set('name', name);
    }

    setColor(color: string): TagBuilder {
        return this.set('color', color);
    }

    setProfile(profile: Profile): TagBuilder {
        return this.set('profile', profile);
    }

    setUserBooks(userBooks: UserBook[]): TagBuilder {
        return this.set('userBooks', userBooks);
    }
}
