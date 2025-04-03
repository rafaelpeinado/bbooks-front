import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { distinctUntilChanged, finalize, map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AddBookUseCase } from 'src/app/core/use-cases/book/add-book.use-case';
import { Author } from 'src/app/core/domain/entities/author.entity';
import { GetAllAuthorsUseCase } from 'src/app/core/use-cases/author/get-all-authors.use-case';
import { UploadFileUseCase } from 'src/app/core/use-cases/cdn/upload-file.use-case';
import { CDN } from 'src/app/core/domain/entities/cdn.entity';
import { CDNFileTpe } from 'src/app/core/domain/enums/cdn-file-type.enum';
import { Book } from 'src/app/core/domain/entities/book.entity';
import { UploadComponent } from 'src/app/views/upload/upload.component';
import { Util } from 'src/app/views/shared/utils/util';
import { BarCodeScannerComponent } from 'src/app/views/shared/bar-code-scanner/bar-code-scanner.component';


@Component({
    selector: 'app-book-form',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

    options: any[] = [];
    filteredOptions: Observable<Author[]>[] = [];
    public formBook: FormGroup;
    public book: Book;
    filteredOptions2: Observable<string[]>[] = [];

    maxSize = 3579139;
    file;
    image;

    constructor(
        public translate: TranslateService,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly addBookUseCase: AddBookUseCase,
        private readonly getAllAuthorsUseCase: GetAllAuthorsUseCase,
        private readonly uploadFileUseCase: UploadFileUseCase,
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.initAuthors();
    }

    private createForm(): void {
        this.formBook = this.formBuilder.group({
            image: new FormControl({ value: null, disabled: true }, Validators.required),
            isbn10: new FormControl(null, Validators.required),
            title: new FormControl(null, Validators.required),
            publisher: new FormControl(null, Validators.required),
            // country: new FormControl(null, Validators.required),
            language: new FormControl(null, Validators.required),
            numberPage: new FormControl(null, Validators.required),
            publishedDate: new FormControl(null, Validators.required),
            description: new FormControl(null, Validators.required),
            // averageRating: new FormControl(null, Validators.required),
            // image: new FormControl(null, Validators.required),
            // searchInfo: new FormControl(null, Validators.required),
            authors: this.formBuilder.array([])
        });
    }

    private createAuthorsForm(id: string, name: string): FormGroup {
        return new FormGroup({
            id: new FormControl(id),
            name: new FormControl(name, Validators.required),
        }
        );
    }

    private initAuthors(): void {
        if (this.book.authors?.length === 0) {
            this.authors.insert(0, this.createAuthorsForm(null, ''));
        }
        this.book.authors?.forEach((author, i) => {
            this.authors.push(this.createAuthorsForm(author.id, author.name));
            this.getAuthors(i);
        });

    }

    get authors(): FormArray {
        return this.formBook.get('authors') as FormArray;
    }

    get users(): FormArray {
        return this.formBook.get('items') as FormArray;
    }


    public removeAuthors(i: number): void {
        this.authors.removeAt(i);
    }

    public addAuthors(): void {
        if (this.authors.length < 3) {
            this.authors.insert(0, this.createAuthorsForm(null, ''));
            this.getAuthors(this.authors.length - 1);
        }
    }

    private _filterAuthors(value: string): Author[] {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.name?.toLowerCase().indexOf(filterValue) === 0);
    }

    getAuthors(index: number) {
        this.getAllAuthorsUseCase.execute().subscribe(authors => {
            this.options = authors;
            this.filteredOptions[index] = this.authors.at(index).get('name').valueChanges
                .pipe(
                    startWith(''),
                    distinctUntilChanged(),
                    map((value) => {
                        if (this._filterAuthors(value).length <= 0) {
                            this.authors.at(index).get('id').setValue('');
                        }
                        return this._filterAuthors(value);
                    })
                );
        });
    }

    resetOption(index: number): void {
        this.authors.at(index).get('id').setValue('');
        this.authors.at(index).get('name').setValue('');
    }

    selectOption(index: number, option) {
        this.authors.at(index).get('id').setValue(option.id);
    }

    onFileChanged(event) {
        if (event?.target?.files?.[0]) {
            const file = event.target.files[0];
            console.log(file);
            const formData = new FormData();
            formData.append('foto', file);
        }

    }
    openDialogUpload() {
        const dialogRef = this.dialog.open(UploadComponent, {
            height: '350px',
            width: '400px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.file = result;
                this.image = this.file;
                const reader = new FileReader();
                reader.onload = (e) => this.image = e.target.result;
                reader.readAsDataURL(this.image);
                this.formBook.get('image').setValue(result.name);
            } else {
                this.file = null;
            }
        });
    }
    saveBook() {
        Util.loadingScreen();
        this.addBookUseCase.execute(this.formBook.value)
            .subscribe(book => {
                Util.loadingScreen();
                const cdn: CDN = {
                    file: this.file,
                    type: CDNFileTpe.IMAGE,
                    info: { objectType: 'book_image', bookId: book.id },
                };
                this.uploadFileUseCase.execute(cdn)
                    .pipe(finalize(() => Util.stopLoading()))
                    .subscribe(() => {
                        this.router.navigateByUrl('/book/' + book.id);
                    }, error => {
                        this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(message => {
                            Util.showErrorDialog(message);
                        });
                        console.log('error upload', error);
                    });
            },
                error => {
                    let codMessage = '';
                    if (error.error.message.includes('BK001')) {
                        codMessage = 'BK001';
                    }
                    if (codMessage) {
                        this.translate.get('MESSAGE_ERROR.' + codMessage).subscribe(message => {
                            Util.showErrorDialog(message);
                        });
                    } else {
                        this.translate.get('PADRAO.OCORREU_UM_ERRO').subscribe(msg => {
                            Util.showErrorDialog(msg);
                        });
                        console.log('error book form', error);
                    }
                });
    }

    readCodeBar(): void {
        const dialogRef = this.dialog.open(BarCodeScannerComponent, {
            height: '550px',
            width: '900px'
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.formBook.get('isbn10').setValue(result);
            }
        });
    }
}
