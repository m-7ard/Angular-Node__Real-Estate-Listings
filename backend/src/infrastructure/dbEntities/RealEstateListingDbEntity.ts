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
}

class RealEstateListingDbEntity {
    constructor(contract: RealEstateListingDbEntityContract) {
        this.id = contract.id;
        this.type = contract.type;
        this.price = contract.price;
        this.street = contract.street;
        this.city = contract.city;
        this.state = contract.state;
        this.zip = contract.zip;
        this.country = contract.country;
        this.client_id = contract.client_id;
        this.date_created = contract.date_created;
    }

    public id: string;
    public type: string;
    public price: number;
    public street: string;
    public city: string;
    public state: string;
    public zip: string;
    public country: string;
    public client_id: ClientDbEntity["id"];
    public date_created: Date;

    public static readonly TABLE_NAME = "real_estate_listings";

    public getInsertEntry() {
        return sql`
            INSERT INTO ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            (id, type, price, street, city, state, zip, country, client_id, date_created)
            VALUES 
            (${this.id}, ${this.type}, ${this.price}, ${this.street}, ${this.city}, ${this.state}, ${this.zip}, ${this.country}, ${this.client_id}, ${this.date_created})
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
                date_created = ${this.date_created}
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
