import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserTO } from '../models/userTO.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    api = environment.api + 'auth/';
    language = new EventEmitter<string>();

    constructor(private http: HttpClient) { }

    getByToken(token: string): Observable<UserTO> {
        return this.http.get<UserTO>(this.api + 'reset-pass/' + token);
    }
    resetPass(ResetPassTO: any): Observable<any> {
        return this.http.put(this.api + 'reset-pass/', ResetPassTO);
    }

    saveByGoogle(userTO: UserTO) {
        return this.http.post(this.api + 'login/google', userTO);
    }

    sendResetPassEmail(dto) {
        return this.http.post(this.api + 'reset-pass', dto);
    }

}
