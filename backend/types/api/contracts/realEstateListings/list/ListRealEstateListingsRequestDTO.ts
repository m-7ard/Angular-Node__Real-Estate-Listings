export interface ListRealEstateListingsRequestDTO {
    bathroomNumber?: number;
    bedroomNumber?:  number;
    city?:           string;
    clientId?:       string;
    country?:        string;
    description?:    string;
    flooringType?:   string;
    maxPrice?:       number;
    minPrice?:       number;
    squareMeters?:   number;
    state?:          string;
    street?:         string;
    title?:          string;
    type?:           string;
    yearBuilt?:      number;
    zip?:            string;
}
