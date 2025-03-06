import { Observable } from 'rxjs';
import { ProfileTO } from '../infrastructure/dtos/user.dto';

export class BookRecommendationTO {
    id: string;
    profileSubmitter: number;
    profileReceived: number;
    idBookGoogle: string;
    idBook: number;
    comentario: string;
    profileTO: Observable<ProfileTO>;
    book: Observable<any>;
}
