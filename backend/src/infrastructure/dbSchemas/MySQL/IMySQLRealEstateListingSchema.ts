import IMySQLClientSchema from "./IMySQLClientSchema";

export default interface IMySQLRealEstateListingSchema {
    id: string;
    type: string;
    price: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    client_id: IMySQLClientSchema["id"];
    date_Created: Date;
}
