import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { UserPublicProfileTO } from '../../../models/UserPublicProfileTO.model';
import { PublicProfileService } from '../../../services/public-profile.service';
import { ActivatedRoute } from '@angular/router';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-about-public-profile',
    templateUrl: './about-public-profile.component.html',
    styleUrls: ['./about-public-profile.component.scss']
})
export class AboutPublicProfileComponent implements OnInit {

    isEditing = false;
    publicProfileTO: UserPublicProfileTO;
    publicProfileId: string;
    isOwner = false;

    constructor(
        private publicProfileService: PublicProfileService,
        private route: ActivatedRoute,
        private getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        this.route.parent.params
            .pipe(
                map(params => params.id)
            )
            .subscribe(result => {
                this.getPublicProfileById(result);
                this.publicProfileId = result;
            }
            );
    }

    getPublicProfileById(idPublic: string) {
        this.publicProfileService.getById(idPublic)
            .pipe(take(1))
            .subscribe(result => {
                const user: User = this.getCachedUserUseCase.execute();
                this.publicProfileTO = result;
                if (this.publicProfileTO.user.id === user.id) {
                    this.isOwner = true;
                }
            }, error => {
                console.log(error);
            });
    }

    isAdm(): boolean {
        return true;
    }

    changeToEdit(): void {
        this.isEditing = !this.isEditing;
    }

    update() {
        this.changeToEdit();
    }

}
