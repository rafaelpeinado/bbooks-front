import { Component, OnDestroy, OnInit } from '@angular/core';
import { TypePostControler } from '../../../models/enums/TypePost.enum';
import { FeedMainManagerService } from '../store/feed-main-manager.service';
import { Observable } from 'rxjs';
import { IFeedMainState } from '../store/state/feed-main.state';
import { take } from 'rxjs/operators';
import { FeedService } from '../../../services/feed.service';
import { PostTO } from '../../../models/PostTO.model';
import { PostService } from '../../../services/post.service';
import { FeedGenericService } from '../../../services/feed-generic.service';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
    public user: User;
    typePostControler = TypePostControler;
    feedRedux$: Observable<IFeedMainState>;
    loading = false;
    page = 0;

    constructor(
        public feedMainManagerService: FeedMainManagerService,
        public feedService: FeedService,
        public postService: PostService,
        public feedGenericService: FeedGenericService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.user = this.getCachedUserUseCase.execute();
        this.getPosts();
        this.feedRedux$ = this.feedMainManagerService.getFeed();
    }

    onScroll(): void {
        this.getPosts();
    }

    getPosts(): void {
        this.loading = true;
        this.feedService.getFeed(5, this.page)
            .pipe(take(1))
            .subscribe(result => {
                this.loading = false;
                this.feedMainManagerService.updatePage(this.page);
                this.feedMainManagerService.getPostOnRedux(result);
                this.getComments(result);
            });
    }

    ngOnDestroy(): void {
        this.feedMainManagerService.clearRedux();
    }
    getComments(content: PostTO[]): void {
        content.forEach((p) => {
            this.postService.getComment(p.id, 5, 0)
                .pipe(take(1))
                .subscribe(result => {
                    const post = this.feedGenericService.convertToNewPost(p);
                    post.comments = result;
                    this.feedMainManagerService.updatePost(post);
                });
        });
    }
}
