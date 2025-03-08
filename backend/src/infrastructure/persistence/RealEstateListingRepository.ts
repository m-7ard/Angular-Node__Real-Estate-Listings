import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IRealEstateListingRepository, { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";
import RealEstateListing from "domain/entities/RealEstateListing";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import RealEstateListingDbEntity from "infrastructure/dbEntities/RealEstateListingDbEntity";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";
import RealEstateListingQueryService from "infrastructure/services/RealEstateListingQueryService";

class RealEstateListingRepository implements IRealEstateListingRepository {
    constructor(private readonly db: IDatabaseConnection, private readonly mapperRegistry: IMapperRegistry, private readonly queryService: RealEstateListingQueryService) {}

    async createAsync(listing: RealEstateListing) {
        const dbEntity = this.mapperRegistry.realEstateListingMapper.domainToDbEntity(listing);
        const insertEntry = dbEntity.getInsertEntry();

        await this.db.executeHeaders({ statement: insertEntry.sql, parameters: insertEntry.values });
    };


    async updateAsync(listing: RealEstateListing): Promise<void> {
        const writeDbEntity = this.mapperRegistry.realEstateListingMapper.domainToDbEntity(listing);
        const entry = writeDbEntity.getUpdateEntry();

        const headers = await this.db.executeHeaders({ statement: entry.sql, parameters: entry.values });
   
        if (headers.affectedRows === 0) {
            throw Error(`No ${RealEstateListingDbEntity.TABLE_NAME} of id "${writeDbEntity.id}" was updated."`);
        }
    };

    async getByIdAsync(id: RealEstateListingId): Promise<RealEstateListing | null> {
        const entry = RealEstateListingDbEntity.getByIdStatement(id.value);
        const [row] = await this.db.executeRows<object | null>({ statement: entry.sql, parameters: entry.values });

        if (row == null) {
            return null;
        }
        
        const listing = this.mapperRegistry.realEstateListingMapper.schemaToDbEntity(row);
        return listing == null ? null : this.mapperRegistry.realEstateListingMapper.dbEntityToDomain(listing);
    };

    async deleteAsync(listing: RealEstateListing): Promise<void> {
        const dbEntity = this.mapperRegistry.realEstateListingMapper.domainToDbEntity(listing);
        const entry = dbEntity.getDeleteStatement();

        const headers = await this.db.executeHeaders({ statement: entry.sql, parameters: entry.values });
   
        if (headers.affectedRows === 0) {
            throw Error(`No ${RealEstateListingDbEntity.TABLE_NAME} of id "${dbEntity.id}" was deleted."`);
        }
    };
    
    async filterAsync(criteria: FilterRealEstateListingsCriteria): Promise<RealEstateListing[]> {
        const dbEntities = await this.queryService.filter({ city: criteria.city, clientId: criteria.clientId == null ? null : criteria.clientId.value, country: criteria.country, maxPrice: criteria.maxPrice == null ? null : criteria.maxPrice.value, minPrice: criteria.minPrice == null ? null : criteria.minPrice.value, state: criteria.state, type: criteria.type == null ? null : criteria.type.value, zip: criteria.zip })
        return dbEntities.map(this.mapperRegistry.realEstateListingMapper.dbEntityToDomain);
    };
}

export default RealEstateListingRepository;
