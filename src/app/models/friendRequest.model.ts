import { ProfileTO } from "../infrastructure/dtos/user.dto";

export class FriendRequest {
    id: string;
    status: string;
    addDate: Date;
    profileTO: ProfileTO;
}

