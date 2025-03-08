import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseInterface } from '../use-case.interface';
import { CDNRepository } from '../../repositories/cdn.repository';
import { CDN } from '../../domain/entities/cdn.entity';

@Injectable({
    providedIn: 'root',
})

export class UploadFileUseCase implements UseCaseInterface {
    constructor(private readonly cdnRepository: CDNRepository) { }

    execute(input: CDN): Observable<void> {
        return this.cdnRepository.uploadFile(input);
    }
}
