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
    date_created: Date;
    title: string;
    square_meters: number;
    year_built: number;
    bathroom_number: number;
    bedroom_number: number;
    description: string;
    flooring_type: string;
    images: string[];
}
