import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../services/group.service';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { BookMonthTO } from '../../../models/BookMonthTO.model';
import { BookCase } from '../../../models/bookCase.model';
import { SearchBookComponent } from '../../shared/search-book/search-book.component';
import { MatDialog } from '@angular/material/dialog';
import { Util } from '../../shared/Utils/util';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';

@Component({
    selector: 'app-book-month',
    templateUrl: './book-month.component.html',
    styleUrls: ['./book-month.component.scss']
})
export class BookMonthComponent implements OnInit {

    groupId: string;
    bookMonthTO: BookMonthTO[] = [];
    bookMonth: BookMonthTO;
    bookCase: BookCase = new BookCase();
    book: any;
    currentDate = new Date();

    constructor(
        private groupService: GroupService,
        private route: ActivatedRoute,
        private getBookByIdUseCase: GetBookByIdUseCase,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.route.parent.params
            .pipe(
                map(params => params.id)
            )
            .subscribe(result => {
                this.groupId = result;
                this.getBookMonth();
            }
            );
    }

    getBookMonth() {
        this.groupService.getBookMonth(this.groupId)
            .pipe(take(1))
            .subscribe(result => {
                this.bookMonthTO = result;
                this.bookMonth = this.bookMonthTO[this.bookMonthTO.length - 1];
                this.getBookCase();
            }, error => {
                console.log(error);
            });
    }

    getBookCase() {
        let apiType: ApiType;
        let id;

        if (this.bookMonth.bookGoogleId) {
            id = this.bookMonth.bookGoogleId;
            apiType = ApiType.GOOGLE;
        } else {
            id = this.bookMonth.bookid;
            apiType = ApiType.BBOOKS;
        }
        this.getBookByIdUseCase.execute(id, apiType).subscribe((book) => {
            this.book = new BookBuilder().copyFrom(book).build();
        });
    }

    addBookMonth() {
        const dialogRef = this.dialog.open(SearchBookComponent, {
            height: '450px',
            width: '400px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            Util.loadingScreen();
            const bookM: BookMonthTO = new BookMonthTO();
            bookM.groupId = this.groupId;
            bookM.bookGoogleId = result?.id;
            bookM.monthYear = new Date();
            bookM.bookid = null;
            this.groupService.postBookMonth(this.groupId, bookM)
                .pipe(take(1))
                .subscribe(() => {
                    Util.stopLoading();
                    Util.showSuccessDialog('Livro adicionado');
                    window.location.reload();
                }, error => {
                    Util.stopLoading();
                    console.log(error);
                });
        });
    }

    deleteBookMonth() {
        Util.loadingScreen();
        this.groupService.deleteBookMonth(this.groupId, this.bookMonth.id)
            .pipe(take(1))
            .subscribe(result => {
                Util.stopLoading();
                Util.showSuccessDialog('Livro excluído!');
                window.location.reload();
            }, error => {
                Util.stopLoading();
                console.log(error);
            });
    }
}
