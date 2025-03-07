import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, take } from 'rxjs/operators';
import { ReadingTrackingTO } from '../../../models/ReadingTrackingTO.model';
import { TrackingDialogComponent } from '../tracking-dialog/tracking-dialog.component';
import {
    BookStatus,
    BookStatusEnglish,
    mapBookStatusEnglish
} from '../../../models/enums/BookStatus.enum';
import { BookAddDialogComponent } from '../../shared/book-add-dialog/book-add-dialog.component';
import { TrackingViewComponent } from '../tracking-view/tracking-view.component';
import { TrackingTO } from '../../../models/TrackingTO.model';
import { TrackingService } from '../../../services/tracking.service';
import { ReviewTO } from '../../../models/ReviewTO.model';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { ReviewService } from '../../../services/review.service';
import { TranslateService } from '@ngx-translate/core';
import { ReferBookDialogComponent } from '../../shared/refer-book-dialog/refer-book-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { ReviewsPagination } from '../../../models/pagination/reviews.pagination';
import { Util } from '../../shared/utils/util';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { UserBookDetails } from 'src/app/core/domain/interfaces/user-book-details.interface';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { GetGeneralStatusBooksUseCase } from 'src/app/core/use-cases/user-book/get-general-status-books.use-case';
import { GeneralStatus } from 'src/app/core/domain/entities/general-status.entity';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-book-view',
    templateUrl: './book-view.component.html',
    styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit, OnDestroy {

    public user: User;
    inscricao: Subscription;
    book: Book;
    userBook: UserBook;
    generalStatus: GeneralStatus;
    stars: number[] = [1, 2, 3, 4, 5];
    rating = 1;
    stringAuthors: string[];
    readingTracking: ReadingTrackingTO[] = [];
    trackings: TrackingTO[] = [];

    status = BookStatus;
    mapEnglish = mapBookStatusEnglish;
    statusEnglish = BookStatusEnglish;
    panelOpenState = true;
    percentage: number;

    reviews: Observable<ReviewTO[]>;
    reviewPagination: ReviewsPagination;

    pageEvent: PageEvent = new PageEvent();

    hasReadingTarget: boolean;

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private trackingService: TrackingService,
        private reviewService: ReviewService,
        private translate: TranslateService,
        private getBookByIdUseCase: GetBookByIdUseCase,
        private getGeneralStatusBooksUseCase: GetGeneralStatusBooksUseCase,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
        Util.loadingScreen();
        this.inscricao = this.route.data.subscribe((data: { userBookDetails: UserBookDetails }) => {
            Util.stopLoading();
            this.userBook = data.userBookDetails.userBook;
            this.book = data.userBookDetails.book;
            this.stringAuthors = this.convertAuthorsToString();
            if (+this.userBook?.id > 0) {
                this.getAllTracking();
            }
        });
        this.pageEvent.pageSize = 10;
        this.pageEvent.pageIndex = 0;
    }

    ngOnInit(): void {
        this.user = this.getCachedUserUseCase.execute();
        this.getBook();
        this.getAllReviews();
    }

    ngOnDestroy(): void {
        this.inscricao.unsubscribe();
        this.reviewPagination = new ReviewsPagination();
    }

    getBook(userbookResult?): void {
        Util.loadingScreen();
        combineLatest([
            this.getBookByIdUseCase.execute(this.book.id, this.book.api),
            this.getGeneralStatusBooksUseCase.execute(this.book.id, this.book.api)
        ]).subscribe((value) => {
            Util.stopLoading();
            this.generalStatus = value[1];
            this.book = value[0];
        });
    }

    getAllTracking() {
        if (this.userBook?.id) {
            Util.loadingScreen();
            this.trackingService.getAllByUserBook(+this.userBook.id).pipe(take(1)).subscribe(trackings => {
                this.trackings = trackings
                    .slice()
                    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                Util.stopLoading();
            },
                error => {
                    console.log('error tracking all by idbook', error);
                });
        }
    }

    getByIdTrackingSpeed(id: string, tracking: TrackingTO) {
        this.trackingService.getById(id).pipe(take(1)).subscribe(result => {
            this.trackings[this.trackings.indexOf(tracking)].velocidadeLeitura = result.velocidadeLeitura;
        },
            error => {
                console.log('error tracking all by idbook', error);
            });
    }

    orderByDate(readingTracking: ReadingTrackingTO[]) {
        if (readingTracking) {
            return readingTracking
                .slice()
                .sort((a, b) =>
                    new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
                );
        }
        return [];
    }

    getPercentTotal(readingTrackings: ReadingTrackingTO[]): number {
        readingTrackings = this.orderByDate(readingTrackings);
        return readingTrackings[0]?.percentage ? readingTrackings[0].percentage : 0;
    }

    verifystatusBook(): boolean {
        return this.userBook.status === this.status.EMPRESTADO || !this.userBook.id;
    }

    verifyPercentageIsLess100() {
        return this.percentage <= 100;
    }

    convertAuthorsToString(): string[] {
        const namesAuthors = this.book.authors?.map(value => value.name);
        return namesAuthors;
    }

    openDialogAddBook(book: Book) {
        const dialogRef = this.dialog.open(BookAddDialogComponent, {
            height: '450px',
            width: '400px',
            data: {
                book
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.getBook(result);
        });
    }

    openDialogReview(r: ReviewTO): void {
        const review = new ReviewTO();
        if (r) {
            review.id = r.id;
            review.title = r.title;
            review.body = r.body;
            review.profileTO = r.profileTO;
        } else {
            review.profileId = +this.user.profile.id;
        }
        if (this.book.api) {
            review.idGoogleBook = this.book.id;
        } else {
            // tslint:disable-next-line:radix
            review.bookId = Number.parseInt(this.book.id);
        }
        const dialogRef = this.dialog.open(ReviewDialogComponent, {
            height: '450px',
            width: '500px',
            data: {
                review,
                book: this.book
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
            if (result) {
                this.getAllReviews();
            }
        });
    }

    openDialogReferBook(book: Book) {
        const dialogRef = this.dialog.open(ReferBookDialogComponent, {
            height: '580px',
            width: '680px',
            data: {
                book
            }
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getBook();
        });
    }

    public calculateDays(): string {
        const currentDate = new Date();
        const lastDayOfYear = new Date('12/31/' + currentDate.getFullYear());
        const diffenceOfDates = Math.abs(lastDayOfYear.getTime() - currentDate.getTime());
        const differenceInDays = Math.ceil(diffenceOfDates / (1000 * 3600 * 24));
        return differenceInDays.toString();
    }

    openDialogReadingTracking(track: TrackingTO, tracking: ReadingTrackingTO, editPag: boolean, trackingUpId: string) {
        const dialogRef = this.dialog.open(TrackingDialogComponent, {
            height: '300px',
            width: '400px',
            data: {
                tracking,
                idUserbook: this.userBook.id,
                canEditPag: editPag,
                trackingUpId
            }
        });
        dialogRef.afterClosed().pipe(switchMap(async res => {
            return await res;

        })).subscribe((result) => {
            if (result) {
                if (result === 'delete') {
                    track.finishedDate = null;
                    track.trackings.splice(track.trackings.indexOf(tracking), 1);
                }
                if (tracking) {
                    tracking = result;
                    this.getByIdTrackingSpeed(track.id, track);
                } else {
                    track.trackings.push(result);
                    this.getByIdTrackingSpeed(track.id, track);
                }
            }
            this.getBook();
        });
    }

    openDialogTrackingView(tracking: TrackingTO) {

        const dialogRef = this.dialog.open(TrackingViewComponent, {
            height: '300px',
            width: '400px',
            data: {
                tracking,
                idUserbook: this.userBook.id,
            }
        });
        dialogRef.afterClosed().pipe(switchMap(async res => {
            return await res;
        })).subscribe((res) => {
            this.getBook();
            if (tracking) {
                tracking = res;
            } else {
                if (res) {
                    this.getAllTracking();
                }
            }
        });
    }

    getStatus(readingTrackings: ReadingTrackingTO[]): string {
        if (readingTrackings?.length > 0) {
            readingTrackings = this.orderByDate(readingTrackings);
            return readingTrackings[0].percentage.toString() === '100' ? 'concluido' : 'pending';
        } else {
            return 'pending';

        }
    }

    getConcluidos(status: string): number {
        let response = 0;
        this.trackings.forEach(tracking => {
            if (status === this.getStatus(tracking.trackings)) {
                response++;
            }
        });
        return response;
    }

    getStatusTranslate(readings: ReadingTrackingTO[]): string {
        const resp = this.getStatus(readings);
        if (resp === 'concluido') {
            return 'PADRAO.CONCLUIDO';
        } else {
            return 'PADRAO.PENDENTE';
        }
    }

    delete(id: string): void {
        Util.loadingScreen();
        this.trackingService.delete(id).pipe(take(1)).subscribe(() => {
            Util.stopLoading();
            this.translate.get('ACOMP_LEITURA.TRACKING_REMOVED').subscribe(msg => {
                Util.showErrorDialog(msg);
            });
            this.getAllTracking();
        },
            error => {
                Util.stopLoading();
                this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(msg => {
                    Util.showErrorDialog(msg);
                });
                console.log(error);
            });
    }

    getAllReviews(): void {
        if (this.book.api === 'google') {
            this.getAllByGoogleBook();
        } else {
            this.getAllByBook();
        }
    }

    deleteReview(r: ReviewTO): void {
        Util.loadingScreen();
        this.reviewService.delete(r.id)
            .pipe(take(1))
            .subscribe(() => {
                Util.stopLoading();
                this.reviews = this.reviews.pipe(take(1));
                this.translate.get('RESENHA.APAGAR_RENHA').subscribe(message => {
                    Util.showSuccessDialog(message);
                });
            });
    }

    changePage(event: PageEvent) {
        this.pageEvent = event;
        this.getAllReviews();
    }

    getAllByGoogleBook(): void {
        this.reviewService.getAllByGoogleBook(
            this.userBook?.id,
            this.pageEvent.pageSize,
            this.pageEvent.pageIndex
        )
            .pipe(take(1))
            .subscribe(reviewsPagination => {
                this.reviewPagination = reviewsPagination;
            });
    }

    getAllByBook(): void {
        this.reviewService.getAllByBook(
            // tslint:disable-next-line:radix
            Number.parseInt(this.book.id),
            this.pageEvent.pageSize,
            this.pageEvent.pageIndex
        )
            .pipe(take(1))
            .subscribe(reviewsPagination => {
                this.reviewPagination = reviewsPagination;
            });
    }

}
