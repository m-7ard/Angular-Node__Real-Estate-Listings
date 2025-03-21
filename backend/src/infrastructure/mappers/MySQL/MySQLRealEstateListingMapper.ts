import RealEstateListingDbEntity from "infrastructure/dbEntities/RealEstateListingDbEntity";
import IRealEstateListingMapper from "../interfaces/IRealEstateListingMapper";
import RealEstateListing from "domain/entities/RealEstateListing";
import IMySQLRealEstateListingSchema from "infrastructure/dbSchemas/MySQL/IMySQLRealEstateListingSchema";
import ClientId from "domain/valueObjects/Client/ClientId";

class MySQLRealEstateListingMapper implements IRealEstateListingMapper {
    schemaToDbEntity(source: IMySQLRealEstateListingSchema): RealEstateListingDbEntity {
        return new RealEstateListingDbEntity({
            id: source.id,
            city: source.city,
            client_id: source.client_id,
            country: source.country,
            date_created: source.date_created,
            price: source.price,
            state: source.state,
            street: source.street,
            type: source.type,
            zip: source.zip,
            title: source.title,
            square_meters: source.square_meters,
            year_built: source.year_built,
            bathroom_number: source.bathroom_number,
            bedroom_number: source.bedroom_number,
            description: source.description,
            flooring_type: source.flooring_type,
            images: JSON.parse(source.images)
        });
    }

    domainToDbEntity(source: RealEstateListing): RealEstateListingDbEntity {
        return new RealEstateListingDbEntity({
            id: source.id.value,
            city: source.address.city,
            client_id: source.clientId.value,
            country: source.address.country,
            date_created: source.dateCreated,
            price: source.price.value,
            state: source.address.state,
            street: source.address.street,
            type: source.type.value,
            zip: source.address.zip,
            title: source.title,
            square_meters: source.info.squareMeters,
            year_built: source.info.yearBuilt,
            bathroom_number: source.info.bathroomNumber,
            bedroom_number: source.info.bedroomNumber,
            description: source.info.description,
            flooring_type: source.info.flooringType,
            images: source.images
        });
    }

    dbEntityToDomain(source: RealEstateListingDbEntity): RealEstateListing {
        return RealEstateListing.executeCreate({
            id: source.id,
            city: source.city,
            clientId: ClientId.executeCreate(source.client_id),
            country: source.country,
            dateCreated: source.date_created,
            price: source.price,
            state: source.state,
            street: source.street,
            type: source.type,
            zip: source.zip,
            squareMeters: source.square_meters,
            yearBuilt: source.year_built,
            bathroomNumber: source.bathroom_number,
            bedroomNumber: source.bedroom_number,
            description: source.description,
            flooringType: source.flooring_type,
            title: source.title,
            images: source.images
        });
    }
}

export default MySQLRealEstateListingMapper;
