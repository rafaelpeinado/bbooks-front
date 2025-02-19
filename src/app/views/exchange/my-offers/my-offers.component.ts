import { Component, OnInit } from '@angular/core';
import { BookAdTO } from '../../../models/BookAdTO.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { map, take } from 'rxjs/operators';
import { Util } from '../../shared/utils/util';
import { BookAdsService } from '../../../services/book-ads.service';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-my-offers',
    templateUrl: './my-offers.component.html',
    styleUrls: ['./my-offers.component.scss']
})
export class MyOffersComponent implements OnInit {
    booksAdsTo: Observable<BookAdTO[]>;

    constructor(
        public bookAdsService: BookAdsService,
        public router: Router,
        private translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        const user: User = this.getCachedUserUseCase.execute();
        this.booksAdsTo =
            this.bookAdsService.getAllByUser(user.id);
    }

    edit(id: string): void {
        this.router.navigate(['/exchange/my-offers/edit/', id]);
    }

    delete(id: string): void {
        this.translate.get('EXCHANGE.EXLUIR_OFFER').subscribe(message => {
            // @ts-ignore
            Swal.fire({
                icon: 'warning',
                text: message,
                showConfirmButton: true,
                confirmButtonText: 'Yes',
                showCancelButton: true,
                cancelButtonText: 'No'
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
                this.booksAdsTo = this.booksAdsTo.pipe(
                    map(ba => ba.filter(i => i.id !== id))
                );
            },
                error => {
                    Util.stopLoading();
                    this.verifyErrorOffer(error, 'error delete offer');
                });
    }
    verifyErrorOffer(error: any, locationError: string): void {
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
}
