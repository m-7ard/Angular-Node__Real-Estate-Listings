export interface CreateRealEstateListingRequestDTO {
    bathroomNumber: number;
    bedroomNumber:  number;
    city:           string;
    clientId:       string;
    country:        string;
    description:    string;
    flooringType:   string;
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
