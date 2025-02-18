import { UserTO } from "../infrastructure/dtos/user.dto";

export class Friendship {
    id: number;
    friends: UserTO[];
}

