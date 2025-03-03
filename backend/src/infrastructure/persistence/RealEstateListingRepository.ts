import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IRealEstateListingRepository from "application/interfaces/persistence/IRealEstateListingRepository";
import Client from "domain/entities/Client";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";

class RealEstateListingRepository implements IRealEstateListingRepository {

    constructor(private readonly db: IDatabaseConnection, private readonly mapper: IMapperRegistry) {}

    async createAsync(client: Client) {
        const dbEntity = this.mapper.clientMapper.domainToDbEntity(client);
        const insertEntry = dbEntity.getInsertEntry();

        await this.db.executeHeaders({ statement: insertEntry.sql, parameters: insertEntry.values });
    };
}

export default RealEstateListingRepository;
