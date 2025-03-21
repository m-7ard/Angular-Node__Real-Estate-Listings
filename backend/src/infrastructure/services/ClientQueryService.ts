import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IDatabaseProviderSingleton from "api/interfaces/IDatabaseProviderSingleton";
import ClientDbEntity from "infrastructure/dbEntities/ClientDbEntity";
import IMySQLClientSchema from "infrastructure/dbSchemas/MySQL/IMySQLClientSchema";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";
import knex, { Knex } from "knex";

export interface FilterClientQueryContract {
    id: string | null;
    type: string | null;
    name: string | null;
}

class ClientQueryService {
    private query: knex.Knex.QueryBuilder<any>;
    private mySQLQuery: knex.Knex.QueryBuilder<IMySQLClientSchema>
    private SQLiteQuery: knex.Knex.QueryBuilder<IMySQLClientSchema>

    private readonly deferedOperations: Array<(listings: ClientDbEntity[]) => ClientDbEntity[]> = [];

    constructor(private readonly connection: IDatabaseConnection, private readonly databaseProviderSingleton: IDatabaseProviderSingleton, private readonly knex: Knex, private readonly mapperRegistry: IMapperRegistry) {
        this.query = this.knex(ClientDbEntity.TABLE_NAME);
        this.mySQLQuery = this.query;
        this.SQLiteQuery = this.query;
    }
    
    async filter(contract: FilterClientQueryContract): Promise<ClientDbEntity[]> {
        if (contract.id != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.whereILike("id", contract.id);
            }

            this.mySQLQuery = this.query;
            this.SQLiteQuery = this.query;
        }

        if (contract.name != null) {
            if (this.databaseProviderSingleton.isMySQL) {
                this.query = this.mySQLQuery.whereILike("name", `%${contract.name}%`);
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

        const entry = this.query.toSQL();
        const rows = await this.connection.executeRows<object>({ statement: entry.sql, parameters: [...entry.bindings] });
        let dbEntities = rows.map(this.mapperRegistry.clientMapper.schemaToDbEntity);
        dbEntities = this.deferedOperations.reduce((acc, fn) => fn(acc), dbEntities);
        return dbEntities;
    };
}

export default ClientQueryService;