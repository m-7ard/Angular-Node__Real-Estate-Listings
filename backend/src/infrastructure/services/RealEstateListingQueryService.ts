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
    private query: knex.Knex.QueryBuilder<any>;
    private mySQLQuery: knex.Knex.QueryBuilder<IMySQLRealEstateListingSchema>
    private SQLiteQuery: knex.Knex.QueryBuilder<IMySQLRealEstateListingSchema>

    private readonly deferedOperations: Array<(listings: RealEstateListingDbEntity[]) => RealEstateListingDbEntity[]> = [];

    constructor(private readonly connection: IDatabaseConnection, private readonly databaseProviderSingleton: IDatabaseProviderSingleton, private readonly knex: Knex, private readonly mapperRegistry: IMapperRegistry) {
        this.query = this.knex(RealEstateListingDbEntity.TABLE_NAME);
        this.mySQLQuery = this.query;
        this.SQLiteQuery = this.query;
    }
    
    async filter(contract: FilterRealEstateListingsQueryContract): Promise<RealEstateListingDbEntity[]> {
        if (contract.maxPrice != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.where("price", "<=", contract.maxPrice)
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        if (contract.minPrice != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.where("price", ">=", contract.minPrice)
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        if (contract.city != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.whereILike("city", contract.city);
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        if (contract.clientId != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.whereILike("client_id", contract.clientId);
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        if (contract.country != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.whereILike("country", contract.country);
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        if (contract.state != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.whereILike("state", contract.state);
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        if (contract.type != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.whereILike("type", contract.type);
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        if (contract.zip != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.whereILike("zip", contract.zip);
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        const entry = this.query.toSQL();
        const rows = await this.connection.executeRows<object>({ statement: entry.sql, parameters: [...entry.bindings] });
        let dbEntities = rows.map(this.mapperRegistry.realEstateListingMapper.schemaToDbEntity);
        dbEntities = this.deferedOperations.reduce((acc, fn) => fn(acc), dbEntities);
        return dbEntities;
    };
}

export default RealEstateListingQueryService;