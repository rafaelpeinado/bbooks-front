import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TemporaryService {
    public language = new EventEmitter<string>();
    public updateListCarrousel = new EventEmitter<any>();
}