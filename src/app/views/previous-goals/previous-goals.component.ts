import { UserBookTO } from './../../models/userBookTO';
import { ReadingTargetTO } from './../../models/readingTargetTO.model';
import { Component, OnInit } from '@angular/core';
import { ReadingTargetService } from 'src/app/services/reading-target.service';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

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
    private getBookByIdUseCase: GetBookByIdUseCase,
    private getCachedUserUseCase: GetCachedUserUseCase,
  ) {
  }

  ngOnInit(): void {
    this.getPreviousGoals();
  }

  getPreviousGoals() {
    const user: User = this.getCachedUserUseCase.execute();
    this.readingTargetService.getAllByProfileId(+user.profile.id)
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

      return this.getBookByIdUseCase.execute(id, apiType)
        .subscribe((book) => userBooks[i].book = book);
    });
  }
}
