import {booksMock} from './book.model.mock';
import {BookCase} from '../models/bookcase.model';

export const bookcaseMock = new BookCase();
bookcaseMock.books = booksMock;
bookcaseMock.id = 1;
bookcaseMock.description = 'teste';

export const bookcasesMock = [bookcaseMock, bookcaseMock, bookcaseMock, bookcaseMock, bookcaseMock];
