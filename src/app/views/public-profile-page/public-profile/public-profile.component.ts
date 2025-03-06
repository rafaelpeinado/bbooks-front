import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { UserPublicProfileTO } from '../../../models/UserPublicProfileTO.model';
import { PublicProfileService } from '../../../services/public-profile.service';
import { ActivatedRoute } from '@angular/router';
import { Util } from '../../shared/utils/util';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-public-profile',
    templateUrl: './public-profile.component.html',
    styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {

    links = ['feed', 'about'];
    publicProfileTO: UserPublicProfileTO;
    publicProfileId: string;
    isOwner = false;
    isFollower = true;
    loading = false;
    constructor(
        private publicProfileService: PublicProfileService,
        private route: ActivatedRoute,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.route.params
            .pipe(
                map(params => params.id)
            )
            .subscribe(result => {
                this.getPublicProfileById(result);
                this.publicProfileId = result;
            }
            );
        this.verifyIsFollower();
    }

    getPublicProfileById(idPublic: string) {
        Util.loadingScreen();
        this.publicProfileService.getById(idPublic)
            .pipe(take(1))
            .subscribe(result => {
                const user: User = this.getCachedUserUseCase.execute();
                this.loading = true;
                Util.stopLoading();
                this.publicProfileTO = result;
                if (this.publicProfileTO.user.id === user.id) {
                    this.isOwner = true;
                }
            }, error => {
                Util.stopLoading();
                this.loading = true;
            });
    }

    getPublicProfile() {
        const user: User = this.getCachedUserUseCase.execute();
        this.publicProfileService.getByUserId(user.id)
            .pipe(take(1))
            .subscribe(result => {
                this.publicProfileTO = result;
            }, error => {
                console.log(error);
            });
    }

    verifyIsFollower() {
        this.publicProfileService.getById(this.publicProfileId)
            .pipe(take(1))
            .subscribe(result => {
                const user: User = this.getCachedUserUseCase.execute();
                this.isFollower = false;
                result.followers.forEach(f => {
                    if (f.id === user.profile.id) {
                        this.isFollower = true;
                    }
                });
            });
    }


    followPublicProfile() {
        this.publicProfileService.follow(this.publicProfileId)
            .pipe(take(1))
            .subscribe(() => {
                this.isFollower = !this.isFollower;
            });
    }

    unfollowPublicProfile() {
        this.publicProfileService.unfollow(this.publicProfileId)
            .pipe(take(1))
            .subscribe(() => {
                this.isFollower = !this.isFollower;
            });
    }
}
