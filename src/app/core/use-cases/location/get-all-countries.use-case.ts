import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseInterface } from '../use-case.interface';
import { LocationRepository } from '../../repositories/location.repository';
import { Location } from '../../domain/entities/location.entity';

@Injectable({
    providedIn: 'root',
})

export class GetAllCountriesUseCase implements UseCaseInterface {
    constructor(private readonly locationRepository: LocationRepository) { }

    execute(): Observable<Location[]> {
        return this.locationRepository.getAllCountries();
    }
}

