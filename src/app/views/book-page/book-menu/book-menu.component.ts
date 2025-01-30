import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Input } from '@angular/core';
import { TagDialogComponent } from '../tag-dialog/tag-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { DeleteTagUseCase } from 'src/app/core/use-cases/tag/delete-tag.use-case';
import { Tag } from 'src/app/core/domain/entities/tag.entity';
import { finalize } from 'rxjs/operators';
import { GetAllTagsByProfileIdTagUseCase } from 'src/app/core/use-cases/tag/get-all-tags-by-profile-id.use-case';

@Component({
    selector: 'app-book-menu',
    templateUrl: './book-menu.component.html',
    styleUrls: ['./book-menu.component.scss']
})
export class BookMenuComponent implements OnInit {
    tags: Tag[];

    bookcasesGbooks: string[] = ['ficção', 'classicos', 'romance', 'literatura'];

    @Input() deviceXs: boolean;
    topVal = 0;

    constructor(
        private router: Router,
        private authService: AuthService,
        private deleteTagUseCase: DeleteTagUseCase,
        private getAllTagsByProfileIdTagUseCase: GetAllTagsByProfileIdTagUseCase,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getTags();
    }

    getTags(): void {
        this.getAllTagsByProfileIdTagUseCase.execute(this.authService.getUser().profile.id)
            .subscribe((tags) => this.tags = tags);
    }

    onScroll(e) {
        const scrollXs = this.deviceXs ? 55 : 73;
        if (this.deviceXs) {
            if (e.srcElement.scrollTop < scrollXs) {
                this.topVal = e.srcElement.scrollTop;
            } else {
                this.topVal = scrollXs;
            }
        }

    }

    sideBarScroll() {
        const e = this.deviceXs ? 117 : 65;
        return e - this.topVal;
    }

    openDialogTag(tag: Tag): void {
        const dialogRef = this.dialog.open(TagDialogComponent, {
            width: '300px',
            height: '250px',
            data: tag
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getTags();
            }
        });
    }

    verifyRouterLink(route: string) {
        return this.router.url.includes(route);
    }

    deleteTag(tagId: string): void {
        this.deleteTagUseCase.execute(tagId)
            .pipe(finalize(() => this.getTags()))
            .subscribe();
    }

}
