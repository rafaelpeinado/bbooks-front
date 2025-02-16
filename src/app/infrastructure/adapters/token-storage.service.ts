import { Injectable } from '@angular/core';
import { StorageItem } from '../enums/storage-item.enum';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    setToken(token: string): void {
        localStorage.setItem(StorageItem.TOKEN, token);
    }

    getToken(): string | null {
        return localStorage.getItem(StorageItem.TOKEN);
    }

    removeToken(): void {
        localStorage.removeItem(StorageItem.TOKEN);
    }
}
