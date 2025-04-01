import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';

@Component({
    selector: 'app-carrousel',
    templateUrl: './carrousel.component.html',
    styleUrls: ['./carrousel.component.scss']
})
export class CarrouselComponent implements OnInit, OnDestroy {

    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 2
            },
            400: {
                items: 3
            },
            740: {
                items: 4
            },
            1100: {
                items: 8
            }
        },
        nav: true
    };

    @Output() updateBooks = new EventEmitter<any>();
    @Output() updateListCarrousel = new EventEmitter<any>();
    @Input() userBooks: UserBook[];
    @Input() nameTag: string;
    @Input() idTag: number;
    mediaSub: Subscription;
    deviceXs;
    isUserBook: boolean;
    routerlink: string;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        public mediaObserver: MediaObserver,
    ) {
    }

    ngOnInit(): void {
        this.mediaSub = this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
            this.deviceXs = result[0].mqAlias === 'xs' ? true : false;
        });
        this.isUserBook = this.router.url.includes('mybooks');
        if (!this.isUserBook) {
            this.routerlink = '/book/';
        } else {
            this.routerlink = '/mybooks/';
        }
    }
    bookReturn(event) {
        this.userBooks[this.userBooks.indexOf((event.book))].status = event.status;
        this.updateBooks.emit({ idbook: event.book.id, status: event.status });
    }

    ngOnDestroy(): void {
        this.mediaSub.unsubscribe();
    }

}
