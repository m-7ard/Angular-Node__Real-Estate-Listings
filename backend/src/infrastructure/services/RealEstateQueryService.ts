import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IDatabaseProviderSingleton from "api/interfaces/IDatabaseProviderSingleton";
import RealEstateListingDbEntity from "infrastructure/dbEntities/RealEstateListingDbEntity";
import IMySQLRealEstateListingSchema from "infrastructure/dbSchemas/MySQL/IMySQLRealEstateListingSchema";
import MySQLRealEstateListingMapper from "infrastructure/mappers/MySQL/MySQLRealEstateListingMapper";
import { Knex } from "knex";

export interface FilterRealEstateListingsQueryContrat {
    type: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
    clientId: string | null;
}

class RealEstateQueryService {
    constructor(private readonly connection: IDatabaseConnection, private readonly databaseProviderSingleton: IDatabaseProviderSingleton, private readonly knex: Knex) {}
    
    async filter(contract: FilterRealEstateListingsQueryContrat): Promise<RealEstateListingDbEntity[]> {
        if (this.databaseProviderSingleton.isMySQL) {
            let query = this.knex<IMySQLRealEstateListingSchema>(RealEstateListingDbEntity.TABLE_NAME);
            
            if (contract.type != null) {
                query = query.whereLike(contract.type);
            }

            if (contract.city != null) {
                query = 
            }
        
        } else {
            throw new Error(`Database Provider of value ${this.databaseProviderSingleton.value}`);
        }

    };
}

export default RealEstateQueryService;