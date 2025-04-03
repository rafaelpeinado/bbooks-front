import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
    @Input() rating: number;
    @Input() idStar: number;

    @Output() starEnter: EventEmitter<number> = new EventEmitter<number>();
    @Output() starLeave: EventEmitter<number> = new EventEmitter<number>();
    @Output() starClicked: EventEmitter<number> = new EventEmitter<number>();

    constructor() { }

    OnStarEnter() {
        this.starEnter.emit(this.idStar);
    }

    onStarLeave() {
        this.starLeave.emit();
    }

    onStarClicked() {
        this.starClicked.emit(this.idStar);
    }

    onKeyDown($event) {
        console.log($event);
    }
}
