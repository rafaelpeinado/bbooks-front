import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CDNRepository } from 'src/app/core/repositories/cdn.repository';
import { CDN } from 'src/app/core/domain/entities/cdn.entity';

@Injectable({
    providedIn: 'root'
})
export class CDNApiService implements CDNRepository {

    private readonly api = environment.api + 'cdn/';
    private readonly apiUpload = this.api + 'upload';

    constructor(private readonly http: HttpClient) { }

    uploadFile(input: CDN): Observable<void> {
        const formData: FormData = new FormData();
        formData.append('file', input.file, input.file.name);
        formData.append('info', JSON.stringify(input.info));
        return this.http.post<void>(this.apiUpload, formData);
    }
}
