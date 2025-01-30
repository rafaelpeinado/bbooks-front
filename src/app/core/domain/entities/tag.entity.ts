import { Profile } from "./profile.entity";
import { UserBook } from "./user-book.entity";

export interface Tag {
    id: string;
    name: string;
    color: string;
    profile: Profile;
    userBooks: UserBook[];
}