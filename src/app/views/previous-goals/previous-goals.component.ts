import { UserBookTO } from './../../models/userBookTO';
import { ReadingTargetTO } from './../../models/readingTargetTO.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ReadingTargetService } from 'src/app/services/reading-target.service';
import { map } from 'rxjs/operators';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { BookBuilder } from 'src/app/core/domain/builders/book.builder';

@Component({
  selector: 'app-previous-goals',
  templateUrl: './previous-goals.component.html',
  styleUrls: ['./previous-goals.component.scss']
})
export class PreviousGoalsComponent implements OnInit {

  panelOpenState = false;
  searchPreviousGoals: any;
  previousGoals: ReadingTargetTO[];

  constructor(
    private readingTargetService: ReadingTargetService,
    public authService: AuthService,
    private getBookByIdUseCase: GetBookByIdUseCase,
  ) {
  }

  ngOnInit(): void {
    this.getPreviousGoals();
  }

  getPreviousGoals() {
    this.readingTargetService.getAllByProfileId(this.authService.getUser().profile.id)
      .subscribe(
        (res) => {
          this.previousGoals = res;
          this.previousGoals.shift();
          this.previousGoals.forEach(r => {
            this.getBookToUserBook(r.targets);
          });
        },
        error => {
          console.log('PreviousGoals Error', error);
        }
      );
  }

  getBookToUserBook(userBooks: UserBookTO[]) {
    userBooks.forEach((realation, i) => {
      let apiType: ApiType;
      let id;

      if (realation.idBookGoogle) {
        id = realation.idBookGoogle;
        apiType = ApiType.GOOGLE;
      } else {
        id = realation.idBook ? realation.idBook : realation.book.id;
        apiType = ApiType.BBOOKS;
      }

      return this.getBookByIdUseCase.execute(id, apiType).pipe(
        map((book) => new BookBuilder()
          .copyFrom(book)
          .setIdUserBook(realation.id)
          .setStatus(realation.status)
          .setFinishDate(realation.finishDate)
          .build()
        )
      ).subscribe((resBook) => userBooks[i].book = resBook);
    });
  }
}
