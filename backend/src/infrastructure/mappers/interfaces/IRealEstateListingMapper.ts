import RealEstateListing from "domain/entities/RealEstateListing"
import RealEstateListingDbEntity from "infrastructure/dbEntities/RealEstateListingDbEntity";

interface IRealEstateListingMapper {
    schemaToDbEntity(source: object): RealEstateListingDbEntity;
    domainToDbEntity(source: RealEstateListing): RealEstateListingDbEntity;
    dbEntityToDomain(source: RealEstateListingDbEntity): RealEstateListing;
}

export default IRealEstateListingMapper;