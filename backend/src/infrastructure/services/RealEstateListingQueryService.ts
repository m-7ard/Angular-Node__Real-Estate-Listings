import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IDatabaseProviderSingleton from "api/interfaces/IDatabaseProviderSingleton";
import RealEstateListingDbEntity from "infrastructure/dbEntities/RealEstateListingDbEntity";
import IMySQLRealEstateListingSchema from "infrastructure/dbSchemas/MySQL/IMySQLRealEstateListingSchema";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";
import knex, { Knex } from "knex";

export interface FilterRealEstateListingsQueryContract {
    type: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
    clientId: string | null;
}

class RealEstateListingQueryService {
    constructor(
        private readonly connection: IDatabaseConnection,
        private readonly databaseProviderSingleton: IDatabaseProviderSingleton,
        private readonly knex: Knex,
        private readonly mapperRegistry: IMapperRegistry,
    ) {}

    async filter(contract: FilterRealEstateListingsQueryContract): Promise<RealEstateListingDbEntity[]> {
        const deferedOperations: Array<(listings: RealEstateListingDbEntity[]) => RealEstateListingDbEntity[]> = [];
        let query: knex.Knex.QueryBuilder<any> = this.knex(RealEstateListingDbEntity.TABLE_NAME);
        let mySQLQuery: knex.Knex.QueryBuilder<IMySQLRealEstateListingSchema> = query;
        let SQLiteQuery: knex.Knex.QueryBuilder<IMySQLRealEstateListingSchema> = query;

        if (contract.maxPrice != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                query = mySQLQuery.where("price", "<=", contract.maxPrice);
            }

            mySQLQuery = query;
            SQLiteQuery = query;
        }

        if (contract.minPrice != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                query = mySQLQuery.where("price", ">=", contract.minPrice);
            }

            mySQLQuery = query;
            SQLiteQuery = query;
        }

        if (contract.city != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                query = mySQLQuery.whereILike("city", `%${contract.city}%`);
            }

            mySQLQuery = query;
            SQLiteQuery = query;
        }

        if (contract.clientId != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                query = mySQLQuery.whereILike("client_id", `%${contract.clientId}%`);
            }

            mySQLQuery = query;
            SQLiteQuery = query;
        }

        if (contract.country != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                query = mySQLQuery.whereILike("country", `%${contract.country}%`);
            }

            mySQLQuery = query;
            SQLiteQuery = query;
        }

        if (contract.state != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                query = mySQLQuery.whereILike("state", `%${contract.state}%`);
            }

            mySQLQuery = query;
            SQLiteQuery = query;
        }

        if (contract.type != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                query = mySQLQuery.whereILike("type", contract.type);
            }

            mySQLQuery = query;
            SQLiteQuery = query;
        }

        if (contract.zip != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                query = mySQLQuery.whereILike("zip", `%${contract.zip}%`);
            }

            mySQLQuery = query;
            SQLiteQuery = query;
        }

        const entry = query.toSQL();
        const rows = await this.connection.executeRows<object>({ statement: entry.sql, parameters: [...entry.bindings] });
        let dbEntities = rows.map(this.mapperRegistry.realEstateListingMapper.schemaToDbEntity);
        dbEntities = deferedOperations.reduce((acc, fn) => fn(acc), dbEntities);
        return dbEntities;
    }
}

export default RealEstateListingQueryService;
