import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../../models/book.model';
import {
    BookStatus,
    BookStatusEnglish,
    getArrayStatus,
    mapBookStatus,
    mapBookStatusEnglish
} from '../../../models/enums/BookStatus.enum';
import { TranslateService } from '@ngx-translate/core';
import { Observable, zip } from 'rxjs';
import { Util } from '../utils/util';
import { DateAdapter } from '@angular/material/core';
import { CreateUserBookUseCase } from 'src/app/core/use-cases/user-book/create-user-book.use-case';
import { UserBook } from 'src/app/core/domain/entities/user-book.entity';
import { UpdateUserBookUseCase } from 'src/app/core/use-cases/user-book/update-user-book.use-case';
import { Tag } from 'src/app/core/domain/entities/tag.entity';
import { GetAllTagsByProfileIdTagUseCase } from 'src/app/core/use-cases/tag/get-all-tags-by-profile-id.use-case';
import { GetAllTagsByUserBookIdUseCase } from 'src/app/core/use-cases/tag/get-all-tags-by-user-book-id.use-case';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';
import { TemporaryService } from 'src/app/services/temporary.service';

@Component({
    selector: 'app-book-add-dialog',
    templateUrl: './book-add-dialog.component.html',
    styleUrls: ['./book-add-dialog.component.scss']
})
export class BookAddDialogComponent implements OnInit {

    AllStatus: BookStatus[] = getArrayStatus();
    tags: Tag[];
    tagsBook: Tag[];
    mapStatus = mapBookStatus;
    mapStatusEnglish = mapBookStatusEnglish;
    status = BookStatus;
    statusEnglish = BookStatusEnglish;
    maxDate = new Date();

    public formBook: FormGroup;
    public Book: Book;
    public title: string;
    public buttonText: string;
    public userBookTo: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { book: Book },
        public dialogRef: MatDialogRef<BookAddDialogComponent>,
        private formBuilder: FormBuilder,
        private adapter: DateAdapter<any>,
        private translate: TranslateService,
        private createUserBookUseCase: CreateUserBookUseCase,
        private updateUserBookUseCase: UpdateUserBookUseCase,
        private getAllTagsByProfileIdTagUseCase: GetAllTagsByProfileIdTagUseCase,
        private getAllTagsByUserBookIdUseCase: GetAllTagsByUserBookIdUseCase,
        private getCachedUserUseCase: GetCachedUserUseCase,
        private temporaryService: TemporaryService,
    ) {
        this.Book = data.book;
        this.tagsBook = [];

        if (this.Book.idUserBook) {
            this.getAllTagsByUserBookIdUseCase.execute(this.Book.idUserBook.toString())
            .subscribe((tags) => {
                this.tagsBook = tags;
                this.modeDialog();
            });
        } else {
            this.modeDialog();
        }
        this.updateLanguageStatus();
        dialogRef.beforeClosed().subscribe(() => {
            this.data.book.status = this.getStatusToUserBookClose();
        });

        const browserLang = this.translate.getBrowserLang().toString();
        this.adapter.setLocale(browserLang);
        this.temporaryService.language.subscribe(lang => {
            this.adapter.setLocale(lang);
        });
    }


    ngOnInit(): void {
        this.createForm();
        this.getTags();

    }

    getTags(): void {
        this.getAllTagsByProfileIdTagUseCase.execute()
        .subscribe((tags) => {
            this.tags = tags;
            this.initTags();
        });
    }

    modeDialog() {
        if (this.Book.idUserBook) {
            this.translate.get('ESTANTE.EDITAR_LIVRO').subscribe(title => {
                this.title = title;
            });
            this.translate.get('PADRAO.EDITAR').subscribe(text => {
                this.buttonText = text;
            });
        } else {
            this.translate.get('ESTANTE.ADICIONAR_LIVRO').subscribe(title => {
                this.title = title;
            });
            this.translate.get('PADRAO.ADICIONAR').subscribe(text => {
                this.buttonText = text;
            });
        }
    }

    private createForm(): void {
        this.formBook = this.formBuilder.group({
            statusBook: new FormControl(this.Book.status ? this.Book.status : null, Validators.required),
            tags: this.formBuilder.array([]),
            finishDate: new FormControl(this.Book.finishDate ?
                this.Book.finishDate.toString() :
                null, this.Book.finishDate ?
                Validators.required :
                Validators.nullValidator),
        });
    }

    private createTagForm(checked: boolean): FormControl {
        return new FormControl(checked);
    }

    private initTags(): void {
        this.tags.forEach((tag, i) => {
            let tagId: Tag;
            if (this.tagsBook !== null) {
                tagId = this.tagsBook.find(t => tag.id === t.id);
            }
            if (tag.id === tagId?.id) {
                this.tagsControl.push(this.createTagForm(true));
            } else {
                this.tagsControl.push(this.createTagForm(false));
            }
        });
    }

    get tagsControl(): FormArray {
        return this.formBook.get('tags') as FormArray;
    }

    getSelectedTags(): Tag[] {
        return this.formBook.value.tags
            .map((checked, i) => checked ? this.tags[i] : null)
            .filter(v => v !== null);
    }

    saveBook() {
        const user: User = this.getCachedUserUseCase.execute();
        this.userBookTo = {
            id: this.Book.idUserBook,
            profileId: user.profile.id,
            status: this.getStatusToUserBook(),
            tags: this.getSelectedTags(),
            page: this.Book.numberPage,
            book: this.Book,
        };
        if (
            this.formBook.get('statusBook').value.toUpperCase() === this.status.LIDO ||
            this.formBook.get('statusBook').value === this.statusEnglish.LIDO
        ) {
            this.userBookTo.finishDate = this.formBook.get('finishDate').value;
        }

        if (this.Book.api === 'google') {
            this.userBookTo.idBookGoogle = this.Book.id;
        } else {
            this.userBookTo.idBook = Number.parseInt(this.Book.id);
        }

        let userBook$: Observable<UserBook>;
        if (this.tagsBook.length > 0 || this.userBookTo.id) {
            userBook$ = this.updateUserBookUseCase.execute(this.userBookTo);
        } else {
            userBook$ = this.createUserBookUseCase.execute(this.userBookTo);
        }
        Util.loadingScreen();
        userBook$.subscribe(
            value => {
                Util.stopLoading();
                this.dialogRef.close(value);
            },
            error => {
                Util.stopLoading();
                console.log('TagDialog Error', error);
            }
        );

    }

    updateLanguageStatus(): void {
        zip(
            this.translate.get('STATUS.QUERO_LER'),
            this.translate.get('STATUS.LENDO'),
            this.translate.get('STATUS.LIDO'),
            this.translate.get('STATUS.EMPRESTADO'),
            this.translate.get('STATUS.RELENDO'),
            this.translate.get('STATUS.INTERROMPIDO'),
            this.translate.get('STATUS.' + this.Book.status),
        ).subscribe(res => {
            this.AllStatus[0] = res[0];
            this.AllStatus[1] = res[1];
            this.AllStatus[2] = res[2];
            this.AllStatus[3] = res[3];
            this.AllStatus[4] = res[4];
            this.AllStatus[5] = res[5];
            this.Book.status = res[6];
        });
    }

    getStatusToUserBook(): any {
        let valueFormStatus = this.formBook.get('statusBook').value;
        const statusEnglish = this.mapStatusEnglish.get(valueFormStatus);
        if (statusEnglish) {
            return statusEnglish;
        } else {
            if (valueFormStatus === 'Quero Ler') {
                valueFormStatus = 'QUERO_LER';
                return valueFormStatus;
            }
            return mapBookStatus.get(valueFormStatus.toUpperCase()).toUpperCase();
        }
    }

    getStatusToUserBookClose(): any {
        const valueFormStatus = this.Book.status.toString() as BookStatusEnglish;
        const statusEnglish = this.mapStatusEnglish.get(valueFormStatus);
        if (statusEnglish) {
            return statusEnglish.toUpperCase();
        } else {
            const status = this.Book.status.toString() as BookStatus;
            return mapBookStatus.get(status);
        }
    }

}
