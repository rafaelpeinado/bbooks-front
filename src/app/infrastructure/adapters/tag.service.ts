import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from 'src/app/core/domain/entities/tag.entity';
import { TagRepository } from 'src/app/core/repositories/tag.repository';
import { environment } from 'src/environments/environment';
import { TagTO } from '../dtos/tag.dto';
import { first, map } from 'rxjs/operators';
import { TagMapper } from '../mappers/tag.mapper';
import { BaseApiService } from './base-service.service';

@Injectable({
    providedIn: 'root'
})
export class TagApiService extends BaseApiService<Tag, TagTO> implements TagRepository {

    private api: string = environment.api + 'tags/';
    private apiProflie: string = this.api + 'profile/';
    private apiBook: string = this.api + 'book/';

    constructor(protected http: HttpClient) {
        super(http);
    }

    getAllTagsByUserBookId(userBookId: string): Observable<Tag[]> {
        return this.http.get<TagTO[]>(this.apiBook + userBookId).pipe(
            first(),
            map((tagsTO) => tagsTO.map((tagTO) => TagMapper.toEntity(tagTO))),
        );
    }

    getAllTagsByProfileId(profileId: string): Observable<Tag[]> {
        return this.http.get<TagTO[]>(this.apiProflie + profileId).pipe(
            first(),
            map((tagsTO) => tagsTO.map((tagTO) => TagMapper.toEntity(tagTO))),
        );
    }

    addTag(tag: Tag): Observable<Tag> {
        const tagTO: TagTO = TagMapper.toDTO(tag);
        const service = this.http.post<TagTO>(this.api, tagTO);
        return this.handleRequestDTOToEntity(service, TagMapper.toEntity);
    }

    editTag(tag: Tag): Observable<Tag> {
        const tagTO: TagTO = TagMapper.toDTO(tag);
        const service = this.http.put<TagTO>(this.api + tagTO.id, tagTO);
        return this.handleRequestDTOToEntity(service, TagMapper.toEntity);
    }

    getTagById(id: string): Observable<Tag> {
        const service = this.http.get<TagTO>(`${this.api}${id}`);
        return this.handleRequestDTOToEntity(service, TagMapper.toEntity);
    }

    deleteTag(id: string): Observable<null> {
        return this.http.delete<null>(this.api + id).pipe(first());
    }
}
