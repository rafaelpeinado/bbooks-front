import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CreateTagUseCase } from 'src/app/core/use-cases/tag/create-tag.use-case';
import { Tag } from 'src/app/core/domain/entities/tag.entity';
import { TagBuilder } from 'src/app/core/domain/builders/tag.builder';
import { EditTagUseCase } from 'src/app/core/use-cases/tag/edit-tag.use-case';
import { GetCachedUserUseCase } from 'src/app/core/use-cases/user/get-cached-user.use-case';
import { User } from 'src/app/core/domain/entities/user.entity';

@Component({
    selector: 'app-tag-dialog',
    templateUrl: './tag-dialog.component.html',
    styleUrls: ['./tag-dialog.component.scss']
})
export class TagDialogComponent implements OnInit {

    public formTag: FormGroup;

    public textForm: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private readonly tag: any,
        public translate: TranslateService,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<Tag>,
        private readonly createTagUseCase: CreateTagUseCase,
        private readonly editTagUseCase: EditTagUseCase,
        private readonly getCachedUserUseCase: GetCachedUserUseCase,
    ) {
    }

    ngOnInit(): void {
        if (this.tag) {
            this.translate.get('PADRAO.EDITAR').subscribe(text => {
                this.textForm = text;
            });
        } else {
            this.translate.get('PADRAO.CRIAR').subscribe(text => {
                this.textForm = text;
            });
        }
        this.createForm();
    }

    private createForm(): void {
        this.formTag = this.formBuilder.group({
            name: new FormControl(this.tag?.name, Validators.compose([
                Validators.maxLength(20),
                Validators.required
            ])),
        });
    }

    save(): void {
        const tag = this.buildTag(this.tag);
        const useCase = this.tag ? this.editTagUseCase : this.createTagUseCase;

        useCase.execute(tag).subscribe((response) => this.dialogRef.close(response));
    }

    private buildTag(tag: any): Tag {
        const builder = TagBuilder.builder().copyFrom(tag).setName(this.formTag.get('name')?.value).setUserBooks([]);

        if (!this.tag) {
            const user: User = this.getCachedUserUseCase.execute();
            builder.setProfile(user.profile);
        }

        return builder.build();
    }

}
