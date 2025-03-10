export interface UpdateRealEstateListingRequestDTO {
    city:     string;
    clientId: string;
    country:  string;
    price:    number;
    state:    string;
    street:   string;
    type:     string;
    zip:      string;
    [property: string]: any;
}
