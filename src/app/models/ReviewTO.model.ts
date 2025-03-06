import { Observable } from 'rxjs';
import { ProfileTO } from '../infrastructure/dtos/user.dto';

export class ReviewTO {
    id: string;
    title: string;
    body: string;
    bookId: number;
    idGoogleBook: string;
    profileId: number;
    creationDate: Date;
    profileTO: Observable<ProfileTO>;
}
