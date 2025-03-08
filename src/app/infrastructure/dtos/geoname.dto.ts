export interface Coordinates {
    lat: string;
    lng: string;
}

export interface GeonameEntity extends Coordinates {
    geonameId: number;
    name: string;
    countryCode: string;
    countryName: string;
    population: number;
}

export interface GeonameCountry extends GeonameEntity, Boundaries {
    continent: string;
    continentName: string;
    capital: string;
    languages: string;
    fipsCode: string;
    isoAlpha3: string;
    isoNumeric: string;
    areaInSqKm: string;
    postalCodeFormat: string;
    currencyCode: string;
}

export interface Boundaries {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface GeonameBase extends GeonameEntity {
    adminCode1: string;
    toponymName: string;
    countryId: string;
    fcl: string;
    fclName: string;
    adminCodes1: AdminCodes1;
    fcodeName: string;
    adminName1: string;
    fcode: string;
}

export interface GeonameLocation<T> {
    totalResultsCount: number;
    geonames: T[];
}

export interface AdminCodes1 {
    ISO3166_2: string;
}
