import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationRepository } from 'src/app/core/repositories/location.repository';
import { Observable } from 'rxjs';
import { GeonameBase, GeonameCountry, GeonameLocation } from '../dtos/geoname.dto';
import { first, map } from 'rxjs/operators';
import { Location } from 'src/app/core/domain/entities/location.entity';

@Injectable({
    providedIn: 'root'
})
export class GeonameApiService implements LocationRepository {
    private readonly api: string = environment.geonameApi;
    private readonly countryInfoApi = this.api + 'countryInfoJSON';
    private readonly childrenApi = this.api + 'childrenJSON';

    private readonly geonameUsername = environment.geonameUserName;

    constructor(private readonly http: HttpClient) { }

    getCitiesByStateId(stateId: string): Observable<Location[]> {
        return this.fetchGeonames<GeonameBase>(stateId);
    }

    getStatesByCountryId(countryId: string): Observable<Location[]> {
        return this.fetchGeonames<GeonameBase>(countryId);
    }

    getAllCountries(): Observable<Location[]> {
        const params = this.createParams();
        return this.http.get<GeonameLocation<GeonameCountry>>(this.countryInfoApi, { params }).pipe(
            first(),
            map((result) => this.mapToLocation(result.geonames, (geo) => geo.countryName))
        );
    }

    private fetchGeonames<T extends GeonameBase>(geonameId: string): Observable<Location[]> {
        const params = this.createParams().set('geonameId', geonameId);
        return this.http.get<GeonameLocation<T>>(this.childrenApi, { params }).pipe(
            first(),
            map((result) => this.mapToLocation(result.geonames, (geo) => geo.toponymName))
        );
    }

    private createParams(): HttpParams {
        return new HttpParams()
            .set('lang', 'pt')
            .set('username', this.geonameUsername);
    }

    private mapToLocation<T extends GeonameBase | GeonameCountry>(data: T[], nameSelector: (geo: T) => string): Location[] {
        return data
            .map((geo) => ({
                id: geo.geonameId.toString(),
                name: nameSelector(geo),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
}
