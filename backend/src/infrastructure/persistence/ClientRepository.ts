import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IClientRepository from "application/interfaces/persistence/IClientRepository";
import Client from "domain/entities/Client";
import ClientId from "domain/valueObjects/Client/ClientId";
import ClientDbEntity from "infrastructure/dbEntities/ClientDbEntity";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";

class ClientRepository implements IClientRepository {

    constructor(private readonly db: IDatabaseConnection, private readonly registry: IMapperRegistry) {}

    async createAsync(client: Client) {
        const dbEntity = this.registry.clientMapper.domainToDbEntity(client);
        const insertEntry = dbEntity.getInsertEntry();

        await this.db.executeHeaders({ statement: insertEntry.sql, parameters: insertEntry.values });
    };

    async getByIdAsync(id: ClientId): Promise<Client | null> {
        const entry = ClientDbEntity.getByIdStatement(id.value);
        const [row] = await this.db.executeRows<object | null>({ statement: entry.sql, parameters: entry.values });

        if (row == null) {
            return null;
        }
        
        const client = this.registry.clientMapper.schemaToDbEntity(row);
        return client == null ? null : this.registry.clientMapper.dbEntityToDomain(client);
    }

    async updateAsync(client: Client): Promise<void> {
        const writeDbEntity = this.registry.clientMapper.domainToDbEntity(client);
        const entry = writeDbEntity.getUpdateEntry();

        const headers = await this.db.executeHeaders({ statement: entry.sql, parameters: entry.values });
   
        if (headers.affectedRows === 0) {
            throw Error(`No team_membership of id "${writeDbEntity.id}" was deleted."`);
        }
    };
}

export default ClientRepository;
