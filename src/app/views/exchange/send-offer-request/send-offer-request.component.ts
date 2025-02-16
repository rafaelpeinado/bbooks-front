import { Component, OnInit } from '@angular/core';
import { Util } from '../../shared/Utils/util';
import { take } from 'rxjs/operators';
import { BookAdsService } from '../../../services/book-ads.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookAdTO } from '../../../models/BookAdTO.model';
import { MatDialog } from '@angular/material/dialog';
import { SearchBookAdtoComponent } from '../search-book-adto/search-book-adto.component';
import { ExchangeService } from '../../../services/exchange.service';
import { ExchangeT0 } from '../../../models/exchangeT0,model';
import { BookExchangeStatus } from '../../../models/enums/BookExchangeStatus.enum';
import { TranslateService } from '@ngx-translate/core';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-send-offer-request',
    templateUrl: './send-offer-request.component.html',
    styleUrls: ['./send-offer-request.component.scss']
})
export class SendOfferRequestComponent implements OnInit {
    bookAdSend: BookAdTO[] = [];
    myBookAdOffer: BookAdTO[] = [];

    constructor(
        public bookAdsService: BookAdsService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public exchangeService: ExchangeService,
        public router: Router,
        public translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.getOfferSend();
    }

    getOfferSend(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            Util.loadingScreen();
            this.bookAdsService.getById(id)
                .pipe(take(1))
                .subscribe(res => {
                    Util.stopLoading();
                    this.bookAdSend.push(res);
                    // this.getBook();
                }, error => {
                    Util.stopLoading();
                    console.log('error book id', error);
                });
        }
    }

    removeBookAdSend(bookAD: BookAdTO): void {
        this.bookAdSend = this.bookAdSend.filter(b => b.id !== bookAD.id);
    }

    removeMyBookAd(bookAD: BookAdTO): void {
        this.myBookAdOffer = this.myBookAdOffer.filter(b => b.id !== bookAD.id);
    }

    openDialogSearchBookAd(): void {
        const dialogRef = this.dialog.open(SearchBookAdtoComponent, {
            height: '600px',
            width: '600px',
            data: {
                idUserOffer: this.bookAdSend[0].userId,
                bookAdsSelected: this.bookAdSend
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.bookAdSend.push(result);
            }
        });
    }

    openDialogMySearchBookAd(): void {
        const user: User = this.getCachedUserUseCase.execute();
        const dialogRef = this.dialog.open(SearchBookAdtoComponent, {
            height: '600px',
            width: '600px',
            data: {
                idUserOffer: user.id,
                bookAdsSelected: this.myBookAdOffer
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.myBookAdOffer.push(result);
            }
        });
    }

    sendProposal(): void {
        const user: User = this.getCachedUserUseCase.execute();
        const exchange = new ExchangeT0();
        exchange.receiverAds = this.bookAdSend;
        exchange.receiverId = this.bookAdSend[0].userId;
        exchange.requesterAds = this.myBookAdOffer;
        exchange.requesterId = user.id;
        exchange.status = BookExchangeStatus.pending;
        Util.loadingScreen();
        this.exchangeService.createExchange(exchange)
            .pipe(take(1))
            .subscribe(result => {
                Util.stopLoading();
                this.router.navigate(['exchange/my-exchanges/sent']);
            },
                error => {
                    Util.stopLoading();
                    this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                        Util.showErrorDialog(message);
                    });
                    console.log('error send propsal', error);
                });
    }

}
