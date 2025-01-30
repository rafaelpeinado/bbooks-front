import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserbookService } from '../../services/userbook.service';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Util } from '../shared/Utils/util';
import { Book } from '../../models/book.model';
import { of, zip } from 'rxjs';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';

@Component({
    selector: 'app-time-line',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit, AfterViewInit {

    title = 'app';

    alternate = false;
    toggle = false;
    color = false;
    dotAnimation = true;
    contentAnimation = true;
    size = 40;
    side = 'left';
    mobileWidthThreshold = 640;
    entries = [];
    books = [];
    loading = true;
    constructor(
        private userBookService: UserbookService,
        private getBookByIdUseCase: GetBookByIdUseCase,
        private authservice: AuthService
    ) {
    }

    async ngOnInit() {
        this.getBooks();
        this.loading = true;
        Util.loadingScreen();

    }

    getBooks(): void {
        this.userBookService.getAllByProfileTimeLine(this.authservice.getUser().profile.id)
            .pipe(
                take(1),
                map(userBook => {
                    const bookObservable = [];
                    userBook.books.forEach((realation) => {
                        let apiType: ApiType;
                        let id;

                        if (realation.idBookGoogle) {
                            id = realation.idBookGoogle;
                            apiType = ApiType.GOOGLE;
                        } else {
                            id = realation.idBook ? realation.idBook : realation.book.id;
                            apiType = ApiType.BBOOKS;
                        }

                        const getById = this.getBookByIdUseCase.execute(id, apiType);
                        bookObservable.push(getById);
                    });
                    return bookObservable.length > 0 ? bookObservable : [of('')];
                }),
            ).pipe(take(1))
            .subscribe(books => {
                zip(
                    ...books
                ).pipe(
                    take(1)
                ).subscribe(r => {
                    this.books = r;
                    this.books.forEach((b) => {
                        if (b.finishDate !== null && b.finishDate !== 0 && b.finishDate) {
                            const date = new Date(b.finishDate);
                            const year = date.getFullYear();
                            this.verifyDate(year, b);
                        }
                    });
                    this.entries = this.entries.sort((a, b) => a.header - b.header);
                    this.loading = false;
                    Util.stopLoading();
                });
            });
    }

    verifyDate(year: number, book?: Book): void {
        const result = this.entries.find(r => r.header === year);
        if (result) {
            const index = this.entries.indexOf(result);
            this.entries[index].content.push(book);
        } else {
            this.addEntry(year, book);
        }
    }

    addEntry(year: number, book: Book) {
        this.entries.push({
            header: year,
            content: [book]
        });
    }

    onExpand(event, index) {
        // console.log(event, index);
    }

    toggleSide() {
        this.side = this.side === 'left' ? 'right' : 'left';
    }

    ngAfterViewInit(): void {
    }


}
