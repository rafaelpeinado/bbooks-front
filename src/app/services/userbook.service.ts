import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserBookTO } from '../models/userBookTO';
import { UserBooksDataStatusTO } from '../models/UserBooksDataStatusTO.model';

@Injectable({
    providedIn: 'root'
})
export class UserbookService {
    api: string = environment.api + 'bookcases/';

    constructor(private http: HttpClient) {
    }

    getAllByProfileTimeLine(profileId: number): Observable<any> {
        const params = new HttpParams()
            .set('timeLine', 'true');
        return this.http.get(this.api + 'profile/' + profileId, { params });
    }

    changeStatus(userBookUpdateStatusTO): Observable<any> {
        return this.http.put(this.api + 'status', userBookUpdateStatusTO);
    }
}
