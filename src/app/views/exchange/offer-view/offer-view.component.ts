import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-offer-view',
    templateUrl: './offer-view.component.html',
    styleUrls: ['./offer-view.component.scss']
})
export class OfferViewComponent implements OnInit {
    slideIndex = 0;

    constructor() {
    }

    ngOnInit(): void {
        this.showSlides(this.slideIndex);
    }

    showSlides(n) {
        let i;
        const slides = document.getElementsByClassName('mySlides');
        const dots = document.getElementsByClassName('demo');
        // const captionText = document.getElementById('caption');
        if (n > slides.length - 1) {
            this.slideIndex = 0;
        }
        if (n < 0) {
            this.slideIndex = slides.length - 1;
        }
        for (i = 0; i < slides.length; i++) {
            /* tslint:disable */
            slides[i]['style'].display = 'none';
            /* tslint:enable */
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace('active', '');
        }
        if (slides?.length > 0) {
            /* tslint:disable */
            slides[this.slideIndex]['style'].display = 'block';
            /* tslint:disable */
        }
        if (dots?.length > 0) {
            dots[this.slideIndex].className += ' active';
        }
//    captionText.innerHTML = dots[this.slideIndex - 1 ]['alt'];
    }

    currentSlide(n) {
        this.showSlides(this.slideIndex = n);
    }

    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }

}
