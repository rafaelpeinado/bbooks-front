import { TypePost } from './enums/TypePost.enum';
import { PostPrivacy } from './enums/PostPrivacy.enum';
import { ReactionsTO } from './ReactionsTO';
import { SurveyTO } from './surveyTO.model';

export class PostTO {
    id: string;
    profileId: number;
    description: string;
    image: string;
    tipoPost: TypePost;
    public comments: PostTO[];
    privacy: PostPrivacy;
    creationDate: Date;
    user: any;
    editMode: boolean;
    groupId: string;
    reactions: ReactionsTO;
    pageId: string;
    survey: SurveyTO;

    public setComments(comments: PostTO[]) {
        this.comments = [];
        this.comments = comments;
    }
}
