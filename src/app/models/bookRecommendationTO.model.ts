import { Observable } from 'rxjs';
import { Profile } from './profileTO.model';

export class BookRecommendationTO {
    id: string;
    profileSubmitter: number;
    profileReceived: number;
    idBookGoogle: string;
    idBook: number;
    comentario: string;
    profileTO: Observable<Profile>;
    book: Observable<any>;
}
