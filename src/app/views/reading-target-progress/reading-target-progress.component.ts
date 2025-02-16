import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/domain/entities/user.entity';
import { ApiType } from 'src/app/core/domain/enums/api-type.enum';
import { GetBookByIdUseCase } from 'src/app/core/use-cases/book/get-book-by-id.use-case';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { ReadingTargetTO } from 'src/app/models/readingTargetTO.model';
import { UserBookTO } from 'src/app/models/userBookTO';
import { ReadingTargetService } from 'src/app/services/reading-target.service';

@Component({
  selector: 'app-reading-target-progress',
  templateUrl: './reading-target-progress.component.html',
  styleUrls: ['./reading-target-progress.component.scss']
})
export class ReadingTargetProgressComponent implements OnInit {

  panelOpenState = false;
  searchPreviousGoals: any;
  previousGoals: ReadingTargetTO[];
  currentDate = new Date().getFullYear();
  currentReadingTarget: ReadingTargetTO;

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
          this.currentReadingTarget = this.previousGoals[0];
          if (this.currentReadingTarget?.targets?.length > 0) {
            this.getBookToUserBook(this.currentReadingTarget?.targets);
          }
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
