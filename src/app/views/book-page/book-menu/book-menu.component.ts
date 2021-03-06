import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BookService} from '../../../services/book.service';
import {MatDialog} from '@angular/material/dialog';
import {Input} from '@angular/core';
import {TagDialogComponent} from '../tag-dialog/tag-dialog.component';
import {TagService} from '../../../services/tag.service';
import {AuthService} from '../../../services/auth.service';
import {Tag} from '../../../models/tag';

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
        private bookService: BookService,
        private tagService: TagService,
        private authService: AuthService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getTags();
    }

    getTags(): void {
        this.tagService.getAllByProfile(this.authService.getUser().profile.id).subscribe((response: Tag[]) => {
            this.tags = response;
        });
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

    deleteTag(tagId: number): void {
        this.tagService.delete(tagId).subscribe(
            value => {
                this.getTags();
            },
            error => {
                console.log('erro bookmenu tag delete', error);
            }
        );
    }

}
