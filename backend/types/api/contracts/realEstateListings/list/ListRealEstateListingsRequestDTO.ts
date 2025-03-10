export interface ListRealEstateListingsRequestDTO {
    city?:     string;
    clientId?: string;
    country?:  string;
    maxPrice?: number;
    minPrice?: number;
    state?:    string;
    street?:   string;
    type?:     string;
    zip?:      string;
    [property: string]: any;
}
