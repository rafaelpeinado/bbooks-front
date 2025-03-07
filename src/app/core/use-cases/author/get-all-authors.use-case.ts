import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseInterface } from '../use-case.interface';
import { AuthorRepository } from '../../repositories/author.repository';
import { Author } from '../../domain/entities/author.entity';

@Injectable({
    providedIn: 'root',
})

export class GetAllAuthorsUseCase implements UseCaseInterface {
    constructor(private readonly authorRepository: AuthorRepository) { }

    execute(): Observable<Author[]> {
        return this.authorRepository.getAllAuthors();
    }
}
