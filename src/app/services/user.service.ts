import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {AuthGuard} from '../guards/auth-guard';
import {UserTO} from '../models/userTO.model';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    api: string = environment.api + 'users/';

    constructor(private http: HttpClient, private auth: AuthService) {
    }

    updateUserInfo() {
        this.http.get(this.api + 'info/').subscribe(response => {
            this.auth.setUser(response);
        });
    }

    verifyEmail(email: string) {
        return this.http.get(this.api + 'email/' + email);
    }

    getById(id: string): Observable<UserTO> {
        return this.http.get<UserTO>(this.api + id);
    }
    getUserName(username: string): Observable<UserTO> {
        return this.http.get<UserTO>(this.api + 'username/' + username);
    }
}
