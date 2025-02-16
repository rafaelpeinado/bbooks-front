import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, zip } from 'rxjs';
import { BookService } from '../../../services/book.service';
import { MatDialog } from '@angular/material/dialog';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { BookStatus, getArrayStatus, mapBookStatus } from '../../../models/enums/BookStatus.enum';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, take } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';
import { GetAllUserBookByProfileIdUseCase } from 'src/app/core/use-cases/user-book/get-all-user-book-by-profile-id.case-use';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { Bookcase } from 'src/app/core/domain/entities/bookcase.entity';


@Component({
    selector: 'app-book-estante',
    templateUrl: './book-estante.component.html',
    styleUrls: ['./book-estante.component.scss']
})
export class BookEstanteComponent implements OnInit, OnDestroy {
    public bookcase: Bookcase;
    search;
    inscricao: Subscription;
    deviceXs;
    mediaSub: Subscription;
    userBook: boolean;
    routerlink: string;
    mapStatus = mapBookStatus;

    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    filterCtrl = new FormControl();
    filteredElements: Observable<BookStatus[]>;
    filter: BookStatus[] = [];
    allStatus: BookStatus[] = getArrayStatus();

    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        public dialog: MatDialog,
        public mediaObserver: MediaObserver,
        private router: Router,
        private translate: TranslateService,
        private getAllUserBookByProfileIdUseCase: GetAllUserBookByProfileIdUseCase,
    ) { }

    ngOnInit(): void {
        this.mediaSub = this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
            this.deviceXs = result[0].mqAlias === 'xs' ? true : false;
        });
        this.userBook = this.verifyrouter();

        this.inscricao = this.route.data.subscribe((data: { bookcase: Bookcase }) => {
            this.bookcase = data.bookcase;
        });
        this.bookService.updateListCarrousel.subscribe(updated => {
            if (updated) {
                const myBook = this.router.url.toString().includes('mybooks');
                if (myBook) {
                    if (this.bookcase.id) {
                        this.bookService.getBookCaseByTag(this.bookcase.id)
                            .pipe(take(1))
                            .subscribe(
                                bcs => {
                                    this.bookcase = bcs;
                                }, error => console.log('error booksComponent', error));

                    } else {
                        this.getAllUserBookByProfileIdUseCase.execute()
                            .subscribe((userBooks) => this.bookcase.userBooks = userBooks);
                    }
                }
            }
        });

        if (!this.userBook) {
            this.routerlink = '/book/';
        } else {
            this.routerlink = '/mybooks/';
        }
        this.translate.onLangChange.subscribe(() => {
            this.updateLanguageStatus();
        });

    }

    updateLanguageStatus(): void {
        zip(
            this.translate.get('STATUS.QUERO_LER'),
            this.translate.get('STATUS.LENDO'),
            this.translate.get('STATUS.LIDO'),
            this.translate.get('STATUS.EMPRESTADO'),
            this.translate.get('STATUS.RELENDO'),
            this.translate.get('STATUS.INTERROMPIDO'),
        ).subscribe(res => {
            this.allStatus[0] = res[0];
            this.allStatus[1] = res[1];
            this.allStatus[2] = res[2];
            this.allStatus[3] = res[3];
            this.allStatus[4] = res[4];
            this.allStatus[5] = res[5];
            this.filteredElements = this.filterCtrl.valueChanges.pipe(
                map((status: string | null) => status ? this._filter(status) : this.allStatus));
        });
    }


    ngOnDestroy(): void {
        this.bookcase = new Bookcase(undefined, undefined, []);
        this.inscricao.unsubscribe();
        this.mediaSub.unsubscribe();
    }

    verifyrouter(): boolean {
        return this.router.url.includes('my');
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '')) {
            this.filter.push();
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        this.filterCtrl.setValue(null);
    }

    remove(status: BookStatus): void {
        const index = this.filter.indexOf(status);
        this.allStatus.push(status);
        if (index >= 0) {
            this.filter.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.filter.push(event.option.value);
        this.allStatus = this.allStatus.filter(status => status !== event.option.value);
        this.fruitInput.nativeElement.value = '';
        this.filterCtrl.setValue(null);
    }

    _filter(value: string): BookStatus[] {
        return this.allStatus.filter(status => status.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }

    filterUserBooks(): UserBook[] {
        if (this.search === undefined || this.search.trim() === null) {
            return this.filterStatus();
        }
        const userBooks = this.filterStatus().filter((userBook) => {
            if (userBook.book.title.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) !== -1) {
                return true;
            } else {
                return false;
            }
        });
        return userBooks;
    }

    filterStatus(): UserBook[] {
        if (this.filter.length <= 0) {
            return this.bookcase.userBooks;
        }
        const userBooks = [];
        this.bookcase.userBooks.filter((userBook) => {
            this.translate.get('STATUS.' + userBook.status).subscribe(statusBook => {
                for (const status of this.filter) {
                    if (status === statusBook) {
                        userBooks.push(userBook);
                    }
                }
            });

        });
        return userBooks;
    }

    bookReturn(event) {
        this.bookcase.userBooks[this.bookcase.userBooks.indexOf((event.book))].status = event.status;
    }


}
