import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthorRepository } from 'src/app/core/repositories/author.repository';
import { Observable } from 'rxjs';
import { Author } from 'src/app/core/domain/entities/author.entity';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthorApiService implements AuthorRepository {

    private api: string = environment.api + 'authors/';

    constructor(private readonly http: HttpClient) { }

    getAllAuthors(): Observable<Author[]> {
        return this.http.get<Author[]>(this.api).pipe(first());
    }
}
