import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

export abstract class BaseApiService<Entity, DTO> {
    constructor(protected readonly http: HttpClient) {}

    protected handleRequestDTOToEntity(service: Observable<DTO>, mapper: (dto: DTO) => Entity): Observable<Entity> {
        return service.pipe(
            first(),
            map(mapper),
            // TODO
            // catchError(error => {
            //     console.error("Erro na API:", error);
            //     return throwError(() => new Error("Erro ao processar requisição"));
            // })
        );
    }
}
