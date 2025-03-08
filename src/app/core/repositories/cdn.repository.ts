import { Observable } from 'rxjs';
import { CDN } from '../domain/entities/cdn.entity';

export abstract class CDNRepository {
    abstract uploadFile(input: CDN): Observable<void>;
}
