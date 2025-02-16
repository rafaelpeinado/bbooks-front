import { Component, OnInit } from '@angular/core';
import { Util } from '../shared/Utils/util';
import { GetAllBookCaseTimelineByProfileIdUseCase } from 'src/app/core/use-cases/user-book/get-all-user-book-timeline-by-profile-id.use-case';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';


@Component({
    selector: 'app-time-line',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {

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
    loading = true;
    constructor(
        private getAllBookCaseTimelineByProfileIdUseCase: GetAllBookCaseTimelineByProfileIdUseCase,
        private getBookByIdUseCase: GetBookByIdUseCase,
    ) {
    }

    async ngOnInit() {
        this.getBooks();
        this.loading = true;
        Util.loadingScreen();

    }

    getBooks(): void {
        this.getAllBookCaseTimelineByProfileIdUseCase.execute()
            .subscribe((userBooks) => {
                userBooks.forEach((userBook) => {
                    if (userBook.finishDate) {
                        const date = new Date(userBook.finishDate);
                        this.verifyDate(date.getFullYear(), userBook);
                    }
                });
                this.entries.sort((a, b) => a.header - b.header);
                this.loading = false;
                Util.stopLoading();
            });
    }

    verifyDate(year: number, userBook?: UserBook): void {
        const result = this.entries.find(r => r.header === year);
        if (result) {
            const index = this.entries.indexOf(result);
            this.entries[index].content.push(userBook.book);
        } else {
            this.addEntry(year, userBook.book);
        }
    }

    addEntry(year: number, book: Book) {
        this.getBookByIdUseCase.execute(book.id, book.api)
            .subscribe((book) => this.entries.push({ header: year, content: [book] }));
    }

    onExpand(event, index) {
        // console.log(event, index);
    }

    toggleSide() {
        this.side = this.side === 'left' ? 'right' : 'left';
    }
}
