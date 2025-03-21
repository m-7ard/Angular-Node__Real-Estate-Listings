export interface ReadRealEstateListingResponseDTO {
    listing: RealEstateListingAPIModel;
}

export interface RealEstateListingAPIModel {
    bathroomNumber: number;
    bedroomNumber:  number;
    city:           string;
    clientId:       string;
    country:        string;
    dateCreated:    Date;
    description:    string;
    flooringType:   string;
    id:             string;
    images:         string[];
    price:          number;
    squareMeters:   number;
    state:          string;
    street:         string;
    title:          string;
    type:           string;
    yearBuilt:      number;
    zip:            string;
}
