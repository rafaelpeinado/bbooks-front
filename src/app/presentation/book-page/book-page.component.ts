import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MediaChange, MediaObserver} from '@angular/flex-layout';


@Component({
    selector: 'app-book-page',
    templateUrl: './book-page.component.html',
    styleUrls: ['./book-page.component.scss']
})
export class BookPageComponent implements OnInit, OnDestroy {
    constructor(
        private readonly mediaObserver: MediaObserver
    ) {
    }

    mediaSub: Subscription;
    deviceXs: boolean;

    ngOnInit(): void {
        this.mediaSub = this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
            this.deviceXs = result[0].mqAlias === 'xs';
        });
    }

    ngOnDestroy(): void {
        this.mediaSub.unsubscribe();
    }


}
