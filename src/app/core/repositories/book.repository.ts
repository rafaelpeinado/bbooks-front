import { Observable } from "rxjs";
import { Book } from "../domain/entities/book.entity";
import { FilterSearch } from "../domain/interfaces/filter-search.interface";
import { PaginationInterface } from "../domain/interfaces/pagination.interface";

export abstract class BookRepository {
    abstract addBook(book: Book): Observable<Book>;
    abstract getBookById(id: string): Observable<Book>;
    abstract searchBooks(FilterSearch: FilterSearch): Observable<PaginationInterface<Book>>;
    abstract searchBookByName(bookName: string): Observable<Book[]>;
    abstract searchBookByNamePagination(FilterSearch: FilterSearch): Observable<PaginationInterface<Book>>;
}