import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Observable, Subscription, zip } from 'rxjs';
import { BookStatus, getArrayStatus, mapBookStatus } from '../../../models/enums/BookStatus.enum';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UserTO } from '../../../models/userTO.model';
import { Bookcase } from 'src/app/core/domain/entities/bookcase.entity';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';

@Component({
    selector: 'app-bookcase',
    templateUrl: './bookcase.component.html',
    styleUrls: ['./bookcase.component.scss']
})
export class BookcaseComponent implements OnInit, OnDestroy {
    public user: User;
    private userTO: UserTO = new UserTO();
    panelOpenState = false;
    public bookcase: Bookcase;
    search;
    inscricao: Subscription;
    deviceXs;
    mediaSub: Subscription;
    userBook: boolean;
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
        public mediaObserver: MediaObserver,
        private translate: TranslateService,
        private getCachedUserUseCase: GetCachedUserUseCase,

    ) {
        this.updateLanguageStatus();
    }

    ngOnInit(): void {
        this.user = this.getCachedUserUseCase.execute();
        this.inscricao = this.route.data.subscribe((data: { data: { bookcase: Bookcase, userTO: UserTO } }) => {
            this.bookcase = data.data.bookcase;
            this.userTO = data.data.userTO;
        });
        this.mediaSub = this.mediaObserver.asObservable().subscribe((result: MediaChange[]) => {
            this.deviceXs = result[0].mqAlias === 'xs' ? true : false;
        });
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

    bookReturn(event) {
        this.bookcase.userBooks[this.bookcase.userBooks.indexOf((event.book))].status = event.status;
    }

    ngOnDestroy(): void {
        this.inscricao.unsubscribe();
        this.mediaSub.unsubscribe();
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

    filterBooks(): UserBook[] {
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

    verifyPerfilPageisUserLogged(): boolean {
        return !!this.user?.id && this.user.id === this.userTO?.id;
    }

}
