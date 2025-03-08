import { Observable } from 'rxjs';
import { Location } from '../domain/entities/location.entity';

export abstract class LocationRepository {
    abstract getAllCountries(): Observable<Location[]>;
    abstract getStatesByCountryId(countryId: string): Observable<Location[]>;
    abstract getCitiesByStateId(stateId: string): Observable<Location[]>;
}
