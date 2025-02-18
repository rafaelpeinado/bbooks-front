import { Component, OnInit } from '@angular/core';
import { Util } from '../../shared/Utils/util';
import { finalize, take } from 'rxjs/operators';
import { BookService } from '../../../services/book.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookAdsService } from '../../../services/book-ads.service';
import { BookAdTO } from '../../../models/BookAdTO.model';
import Swal from 'sweetalert2';
import { zip } from 'rxjs';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { GetUserByIdUseCase } from 'src/app/core/use-cases/user/get-user-by-id.use-case';

@Component({
    selector: 'app-offer-view',
    templateUrl: './offer-view.component.html',
    styleUrls: ['./offer-view.component.scss']
})
export class OfferViewComponent implements OnInit {
    public user: User;
    slideIndex = 0;
    bookAdTO: BookAdTO;
    book: Book;
    constructor(
        public bookService: BookService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private getBookByIdUseCase: GetBookByIdUseCase,
        public bookAdsService: BookAdsService,
        public router: Router,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase,
    ) {
    }

    ngOnInit(): void {
        this.user = this.getCachedUserUseCase.execute();
        this.showSlides(this.slideIndex);
        this.getOffer();
    }

    getOffer(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            Util.loadingScreen();
            this.bookAdsService.getById(id)
                .pipe(take(1))
                .subscribe(res => {
                    Util.stopLoading();
                    this.bookAdTO = res;
                    this.getBook();
                    this.getUserOffer();
                }, error => {
                    Util.stopLoading();
                    this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                        Util.showErrorDialog(message);
                    });
                    console.log('error book ad id', error);
                });
        }
    }
    getUserOffer(): void {
        Util.loadingScreen();
        this.getUserByIdUseCase.execute(this.bookAdTO.userId)
            .pipe(finalize(() => Util.stopLoading()))
            .subscribe((user) => this.user = user);
    }
    getBook() {
        Util.loadingScreen();
        let apiType: ApiType;
        let id;

        if (this.bookAdTO.idBookGoogle) {
            id = this.bookAdTO.idBookGoogle;
            apiType = ApiType.GOOGLE;
        } else {
            id = this.bookAdTO.bookId;
            apiType = ApiType.BBOOKS;
        }

        this.getBookByIdUseCase.execute(id, apiType)
            .subscribe((book) => {
                this.book = BookBuilder.builder()
                    .copyFrom(book)
                    .build();
                if (apiType === ApiType.GOOGLE) {
                    this.bookAdTO.images.push(this.book.image);
                    this.currentSlide(0);
                }
                Util.stopLoading();
            });
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
    delete(id: string): void {
        zip(
            this.translate.get('EXCHANGE.EXLUIR_OFFER'),
            this.translate.get('PADRAO.NAO'),
            this.translate.get('PADRAO.SIM')
        ).subscribe(messages => {
            // @ts-ignore
            Swal.fire({
                icon: 'warning',
                text: messages[0],
                showConfirmButton: true,
                confirmButtonText: messages[2],
                showCancelButton: true,
                cancelButtonText: messages[1]
            }).then((result) => {
                if (result.value) {
                    this.deleteService(id);
                }
            });
        });
    }

    deleteService(id: string): void {
        Util.loadingScreen();
        this.bookAdsService.delete(id)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                this.translate.get('EXCHANGE.OFFER_EXCLUIDA').subscribe(msg => {
                    Util.showSuccessDialog(msg);
                });
                this.router.navigate(['/exchange/my-offers/']);
            },
                error => {
                    Util.stopLoading();
                    this.verifyErrorOfferView(error, 'error delete offer on offer view');

                });
    }

    verifyErrorOfferView(error: any, locationError: string): void {
        let codMessage = '';
        if (error.error.message.includes('BAD003')) {
            codMessage = 'BAD003';
        }
        if (codMessage) {
            this.translate.get('MESSAGE_ERROR.' + codMessage).subscribe(message => {
                Util.showErrorDialog(message);
            });
        } else {
            this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(msg => {
                Util.showErrorDialog(msg);
            });
            console.log(locationError + ': ', error);
        }
    }
    isMobile() {
        const userAgent = window.navigator.userAgent.toLocaleLowerCase();
        return userAgent.includes('iphone') || userAgent.includes('android');
    }
}
