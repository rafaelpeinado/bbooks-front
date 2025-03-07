import { Observable } from 'rxjs';
import { Author } from '../domain/entities/author.entity';

export abstract class AuthorRepository {
    abstract getAllAuthors(): Observable<Author[]>;
}
