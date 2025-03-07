import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IRealEstateListingRepository, { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";
import RealEstateListing from "domain/entities/RealEstateListing";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import RealEstateListingDbEntity from "infrastructure/dbEntities/RealEstateListingDbEntity";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";
import { Knex } from "knex";

class RealEstateListingRepository implements IRealEstateListingRepository {

    constructor(private readonly db: IDatabaseConnection, private readonly mapper: IMapperRegistry, private readonly knexQueryBuilder: Knex) {}

    async createAsync(listing: RealEstateListing) {
        const dbEntity = this.mapper.realEstateListingMapper.domainToDbEntity(listing);
        const insertEntry = dbEntity.getInsertEntry();

        await this.db.executeHeaders({ statement: insertEntry.sql, parameters: insertEntry.values });
    };


    async updateAsync(listing: RealEstateListing): Promise<void> {
        const writeDbEntity = this.mapper.realEstateListingMapper.domainToDbEntity(listing);
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
        
        const listing = this.mapper.realEstateListingMapper.schemaToDbEntity(row);
        return listing == null ? null : this.mapper.realEstateListingMapper.dbEntityToDomain(listing);
    };

    async deleteAsync(listing: RealEstateListing): Promise<void> {
        const dbEntity = this.mapper.realEstateListingMapper.domainToDbEntity(listing);
        const entry = dbEntity.getDeleteStatement();

        const headers = await this.db.executeHeaders({ statement: entry.sql, parameters: entry.values });
   
        if (headers.affectedRows === 0) {
            throw Error(`No ${RealEstateListingDbEntity.TABLE_NAME} of id "${dbEntity.id}" was deleted."`);
        }
    };
    
    async filterAsync(criteria: FilterRealEstateListingsCriteria): Promise<RealEstateListing[]> {
        const query = 
    };
}

export default RealEstateListingRepository;
