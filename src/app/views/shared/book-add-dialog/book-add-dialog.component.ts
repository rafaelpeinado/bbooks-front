import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { UserBookBuilder } from 'src/app/core/domain/builders/user-book.builder';
import { BookStatus, BookStatusEnglish, getArrayStatus, mapBookStatus, mapBookStatusEnglish } from 'src/app/core/domain/enums/book-status.enum';
import { Book } from 'src/app/core/domain/entities/book.entity';

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
    public userBook: UserBook;
    public book: Book;
    public title: string;
    public buttonText: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private readonly data: { userBook: UserBook, book: Book },
        private readonly dialogRef: MatDialogRef<BookAddDialogComponent>,
        private readonly formBuilder: FormBuilder,
        private readonly adapter: DateAdapter<any>,
        private readonly translate: TranslateService,
        private readonly createUserBookUseCase: CreateUserBookUseCase,
        private readonly updateUserBookUseCase: UpdateUserBookUseCase,
        private readonly getAllTagsByProfileIdTagUseCase: GetAllTagsByProfileIdTagUseCase,
        private readonly getAllTagsByUserBookIdUseCase: GetAllTagsByUserBookIdUseCase,
        private readonly getCachedUserUseCase: GetCachedUserUseCase,
        private readonly temporaryService: TemporaryService,
    ) {
        this.userBook = data.userBook;
        this.book = data.book;
        this.tagsBook = [];

        if (this.userBook?.id) {
            this.getAllTagsByUserBookIdUseCase.execute(this.userBook.id)
                .subscribe((tags) => {
                    this.tagsBook = tags;
                    this.modeDialog();
                });
        } else {
            this.modeDialog();
        }
        this.updateLanguageStatus();
        dialogRef.beforeClosed().subscribe(() => {
            this.data.userBook = UserBookBuilder.builder().setStatus(this.getStatusToUserBookClose()).setBook(this.book).build();
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
        if (this.userBook?.id) {
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
            statusBook: new FormControl(this.userBook?.status ? this.userBook.status : null, Validators.required),
            tags: this.formBuilder.array([]),
            finishDate: new FormControl(this.userBook?.finishDate ?
                this.userBook.finishDate.toString() :
                null, this.userBook?.finishDate ?
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

        const userBookBuilder: UserBookBuilder = UserBookBuilder.builder()
            .copyFrom(this.userBook)
            .setProfileId(user.profile.id)
            .setStatus(this.getStatusToUserBook())
            .setBook(this.book)
            .setTags(this.getSelectedTags());

        const statusBookValue = this.formBook.get('statusBook').value;
        if (statusBookValue.toUpperCase() === this.status.LIDO || statusBookValue === this.statusEnglish.LIDO) {
            userBookBuilder.setFinishDate(this.formBook.get('finishDate').value);
        }

        let userBook$: Observable<UserBook>;
        if (this.tagsBook.length > 0 || this.userBook.id) {
            userBook$ = this.updateUserBookUseCase.execute(userBookBuilder.build());
        } else {
            userBook$ = this.createUserBookUseCase.execute(userBookBuilder.build());
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
            this.translate.get('STATUS.' + this.userBook?.status),
        ).subscribe(res => {
            this.AllStatus[0] = res[0];
            this.AllStatus[1] = res[1];
            this.AllStatus[2] = res[2];
            this.AllStatus[3] = res[3];
            this.AllStatus[4] = res[4];
            this.AllStatus[5] = res[5];
            this.userBook = UserBookBuilder.builder().setStatus(res[6]).build();
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
        const valueFormStatus = this.userBook.status.toString() as BookStatusEnglish;
        const statusEnglish = this.mapStatusEnglish.get(valueFormStatus);
        if (statusEnglish) {
            return statusEnglish.toUpperCase();
        } else {
            const status = this.userBook.status.toString() as BookStatus;
            return mapBookStatus.get(status);
        }
    }

}
