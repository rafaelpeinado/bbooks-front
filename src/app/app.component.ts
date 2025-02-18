import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Book } from './core/domain/entities/book.entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bbooks';

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.get<Book[]>('assets/books-cached.json')
      .subscribe((books) => localStorage.setItem('books', JSON.stringify(books)));
  }

}
