import sql, { raw } from "sql-template-tag";
import ClientDbEntity from "./ClientDbEntity";

interface RealEstateListingDbEntityContract {
    id: string;
    type: string;
    price: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    client_id: ClientDbEntity["id"];
    date_created: Date;
    title: string;
    square_meters: number;
    year_built: number;
    bathroom_number: number;
    bedroom_number: number;
    description: string;
    flooring_type: string;
}

class RealEstateListingDbEntity {
    constructor(contract: RealEstateListingDbEntityContract) {
        this.bathroom_number = contract.bathroom_number;
        this.bedroom_number = contract.bedroom_number;
        this.city = contract.city;
        this.client_id = contract.client_id;
        this.country = contract.country;
        this.date_created = contract.date_created;
        this.description = contract.description;
        this.flooring_type = contract.flooring_type;
        this.id = contract.id;
        this.price = contract.price;
        this.square_meters = contract.square_meters;
        this.state = contract.state;
        this.street = contract.street;
        this.title = contract.title;
        this.type = contract.type;
        this.year_built = contract.year_built;
        this.zip = contract.zip;
    }

    public bathroom_number: number;
    public bedroom_number: number;
    public city: string;
    public client_id: ClientDbEntity["id"];
    public country: string;
    public date_created: Date;
    public description: string;
    public flooring_type: string;
    public id: string;
    public price: number;
    public square_meters: number;
    public state: string;
    public street: string;
    public title: string;
    public type: string;
    public year_built: number;
    public zip: string;

    public static readonly TABLE_NAME = "real_estate_listings";

    public getInsertEntry() {
        return sql`
            INSERT INTO ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            (
                id,
                type,
                price,
                street,
                city,
                state,
                zip,
                country,
                client_id,
                date_created,
                title,
                square_meters,
                year_built,
                bathroom_number,
                bedroom_number,
                description,
                flooring_type

            )
            VALUES 
            (
                ${this.id}, 
                ${this.type}, 
                ${this.price}, 
                ${this.street}, 
                ${this.city}, 
                ${this.state}, 
                ${this.zip}, 
                ${this.country}, 
                ${this.client_id}, 
                ${this.date_created},
                ${this.title},
                ${this.square_meters},
                ${this.year_built},
                ${this.bathroom_number},
                ${this.bedroom_number},
                ${this.description},
                ${this.flooring_type}
            )
        `;
    }

    public getUpdateEntry() {
        return sql`
            UPDATE ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            SET 
                id = ${this.id}, 
                type = ${this.type}, 
                price = ${this.price}, 
                street = ${this.street}, 
                city = ${this.city}, 
                state = ${this.state}, 
                zip = ${this.zip}, 
                country = ${this.country}, 
                client_id = ${this.client_id}, 
                date_created = ${this.date_created},
                title = ${this.title}, 
                square_meters = ${this.square_meters}, 
                year_built = ${this.year_built}, 
                bathroom_number = ${this.bathroom_number}, 
                bedroom_number = ${this.bedroom_number}, 
                description = ${this.description}, 
                flooring_type = ${this.flooring_type}
            WHERE
                id = ${this.id}
        `;
    }

    public static getByIdStatement(id: RealEstateListingDbEntity["id"]) {
        return sql`
            SELECT * FROM ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            WHERE id = ${id}
        `;
    }

    public getDeleteStatement() {
        return sql`
            DELETE FROM ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            WHERE id = ${this.id}
        `;
    }
}


export default RealEstateListingDbEntity;
