import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

export abstract class BaseApiService<Entity, DTO> {
    constructor(protected readonly http: HttpClient) {}

    protected handleRequestDTOToEntity(service: Observable<DTO>, mapper: (dto: DTO) => Entity): Observable<Entity> {
        return service.pipe(
            first(),
            map(mapper),
            // TODO fazer tratativa de erro
        );
    }
}
