import RealEstateListingDbEntity from "infrastructure/dbEntities/RealEstateListingDbEntity";
import IRealEstateListingMapper from "../interfaces/IRealEstateListingMapper";
import RealEstateListing from "domain/entities/RealEstateListing";
import IMySQLRealEstateListingSchema from "infrastructure/dbSchemas/MySQL/IMySQLRealEstateListingSchema";
import ClientId from "domain/valueObjects/Client/ClientId";

class MySQLRealEstateListingMapper implements IRealEstateListingMapper {
    schemaToDbEntity(source: IMySQLRealEstateListingSchema): RealEstateListingDbEntity {
        return new RealEstateListingDbEntity({
            "id": source.id,
            "city": source.city,
            "client_id": source.client_id,
            "country": source.country,
            "date_created": source.date_Created,
            "price": source.price,
            "state": source.state,
            "street": source.street,
            "type": source.type,
            "zip": source.zip
        });
    }

    domainToDbEntity(source: RealEstateListing): RealEstateListingDbEntity {
        return new RealEstateListingDbEntity({
            "id": source.id.value,
            "city": source.address.city,
            "client_id": source.clientId.value,
            "country": source.address.country,
            "date_created": source.dateCreated,
            "price": source.price.value,
            "state": source.address.state,
            "street": source.address.street,
            "type": source.type.value,
            "zip": source.address.zip
        });
    }

    dbEntityToDomain(source: RealEstateListingDbEntity): RealEstateListing {
        return RealEstateListing.executeCreate({
            "id": source.id,
            "city": source.city,
            "clientId": ClientId.executeCreate(source.client_id),
            "country": source.country,
            "dateCreated": source.date_created,
            "price": source.price,
            "state": source.state,
            "street": source.street,
            "type": source.type,
            "zip": source.zip
        });
    }
}

export default MySQLRealEstateListingMapper;
