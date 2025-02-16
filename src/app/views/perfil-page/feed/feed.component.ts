import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserTO } from '../../../models/userTO.model';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../../services/post.service';
import { PostTO } from '../../../models/PostTO.model';
import { TranslateService } from '@ngx-translate/core';
import { FeedService } from '../../../services/feed.service';
import { FeedPerfilManageService } from '../store/feed-perfil-manage.service';
import { IFeedState } from '../store/state/feed.state.interface';
import { Observable } from 'rxjs';
import { TypePostControler } from '../../../models/enums/TypePost.enum';
import { FeedGenericService } from '../../../services/feed-generic.service';
import { PostPagination } from '../../../models/pagination/post.pagination';
import { User } from 'src/app/core/domain/entities/user.entity';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
    public user: User;
    userTO: UserTO;
    page = 0;
    loading = false;
    feedRedux$: Observable<IFeedState>;
    typePostControler = TypePostControler;

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        public postService: PostService,
        public translate: TranslateService,
        public feedService: FeedService,
        private feedPerfilManage: FeedPerfilManageService,
        public feedGenericService: FeedGenericService,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.user = this.getCachedUserUseCase.execute();
        this.route.data.pipe(take(1)).subscribe((data: { user: UserTO }) => {
            this.userTO = data.user;
            this.getPosts();
        });
        this.feedRedux$ = this.feedPerfilManage.getFeed();
    }

    onScroll() {
        this.getPosts();
    }

    getPosts(): void {
        if (this.userTO.id === this.user.id) {
            this.loading = true;
            this.postService.getByProfileId(+this.user.profile.id, 5, this.page)
                .pipe(take(1))
                .subscribe(result => {
                    this.loading = false;
                    if (result.content.length === 1) {
                        this.feedRedux$.pipe(take((1))).subscribe(feed => {
                            if (feed[0]?.id === result?.content[0]?.id) {
                                result.content.shift();
                            }
                            this.updateRedux(result);
                        });
                    } else {
                        this.updateRedux(result);
                    }
                });
        } else {
            this.loading = true;
            this.feedService.getPersonFeed(this.userTO.profile.id, 5, this.page)
                .pipe(take(1))
                .subscribe(result => {
                    this.loading = false;
                    if (result.content.length === 1) {
                        this.feedRedux$.pipe(take((1))).subscribe(feed => {
                            if (feed[0]?.id === result?.content[0]?.id) {
                                result.content.shift();
                            }
                            this.updateRedux(result);
                        });
                    } else {
                        this.updateRedux(result);
                    }
                });
        }
    }

    ngOnDestroy(): void {
        this.feedPerfilManage.clearRedux();
    }

    getComments(content: PostTO[]): void {
        content.forEach((p) => {
            this.postService.getComment(p.id, 5, 0)
                .pipe(take(1))
                .subscribe(result => {
                    const post = this.feedGenericService.convertToNewPost(p);
                    post.comments = result;
                    this.feedPerfilManage.updatePost(post);
                });
        });
    }

    updateRedux(result: PostPagination): void {
        if (result?.content?.length > 0) {
            this.page = this.page + 1;
            this.feedPerfilManage.updatePage(this.page);
            this.feedPerfilManage.getPostOnRedux(result.content);
            this.getComments(result.content);
        }
    }
}
