import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BookAddDialogComponent} from './book-add-dialog.component';
import {MaterialModule} from '../../../material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {SocialLoginModule} from 'angularx-social-login';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {TagService} from '../../../services/tag.service';
import {SocialAuthServiceConfigMock} from '../../../mocks/google.provide.mock';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';
import {bookMock} from '../../../mocks/book.model.mock';
import {tagsMock} from '../../../mocks/tag.model.mock';
import {UserbookService} from '../../../services/userbook.service';
import {TranslateServiceMockForChild} from '../../../mocks/translate.service.mock';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {TranslateService, TranslateStore} from '@ngx-translate/core';

describe('BookAddDialogComponent', () => {
    let component: BookAddDialogComponent;
    let fixture: ComponentFixture<BookAddDialogComponent>;

    const mockMatDialog = {
        open: jest.fn(() => {
            return {
                afterClosed: jest.fn(() => of([]))
            };
        })
    };
    const matDialogRefMock = {
        close: jest.fn((response) => {
            return response;
        }),
        beforeClosed: jest.fn(() => of([]))
    };

    const data = {
        book: bookMock
    };

    const userMock = {
        profile: {
            id: 10
        }
    };
    const authServiceMock = {
        getUser: jest.fn(() => userMock)
    };

    const tagServiceMock = {
        getAllByProfile: jest.fn(() => of(tagsMock)),
        getAllByUserBook: jest.fn(() => of(tagsMock)),
        delete: jest.fn(() => of(null))
    };

    const userbookServiceMock = {
        update: jest.fn(() => of()),
        save: jest.fn(() => of()),
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BookAddDialogComponent],
            imports: [
                MaterialModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                MaterialModule,
                CarouselModule,
                SocialLoginModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateServiceMockForChild,
                BrowserDynamicTestingModule
            ],
            providers: [
                TagService,
                SocialAuthServiceConfigMock,
                {
                    provide: MatDialog,
                    useValue: mockMatDialog
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: data
                },
                {
                    provide: MatDialogRef,
                    useValue: matDialogRefMock
                },
                {
                    provide: AuthService,
                    useValue: authServiceMock
                },
                {
                    provide: TagService,
                    useValue: tagServiceMock
                },
                {
                    provide: UserbookService,
                    useValue: userbookServiceMock
                },
                TranslateService,
                TranslateStore
            ]

        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookAddDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('tags in component of profile', () => {
        expect(component.tags).toEqual(tagsMock);
    });

    it('form invalid when input statusBook is empty', () => {
        component.Book.status = null;
        component.tagsBook = [];
        component.ngOnInit();
        const newLocal = 'statusBook';
        const tagInput = component.formBook.controls[newLocal];
        expect(tagInput.errors.required).toBeTruthy();
        expect(component.formBook.invalid).toBeTruthy();
    });

    it('should call save and call userbookservice update', () => {
        component.tagsBook = tagsMock;
        const spyComponent = jest.spyOn(component, 'saveBook');
        const spyUserBookService = jest.spyOn(userbookServiceMock, 'update');
        component.formBook.get('statusBook').setValue('LIDO');
        component.saveBook();
        expect(spyComponent).toHaveBeenCalled();
        expect(spyUserBookService).toHaveBeenCalled();
    });

    it('should call save and and call userbookservice save', () => {
        component.tagsBook = [];
        component.userBookTo.id = null;
        component.ngOnInit();
        const spyComponent = jest.spyOn(component, 'saveBook');
        const spyUserBookService = jest.spyOn(userbookServiceMock, 'save');
        component.formBook.get('statusBook').setValue('LIDO');
        component.saveBook();
        expect(spyComponent).toHaveBeenCalled();
        expect(spyUserBookService).toHaveBeenCalled();
    });

    it('test text on create mode  ', () => {
        component.tagsBook = [];
        component.Book.idUserBook = null;
        expect(component.title).toEqual('ESTANTE.ADICIONAR_LIVRO');
        expect(component.buttonText).toEqual('PADRAO.ADICIONAR');
    });

});
