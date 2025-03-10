export interface ListRealEstateListingsResponseDTO {
    listings: RealEstateListingAPIModel[];
    [property: string]: any;
}

export interface RealEstateListingAPIModel {
    city:        string;
    clientId:    string;
    country:     string;
    dateCreated: Date;
    id:          string;
    price:       number;
    state:       string;
    street:      string;
    type:        string;
    zip:         string;
    [property: string]: any;
}
