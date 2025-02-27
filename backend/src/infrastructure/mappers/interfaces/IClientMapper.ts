import Client from "domain/entities/Client"
import ClientDbEntity from "infrastructure/dbEntities/ClientDbEntity"

interface IClientMapper {
    schemaToDbEntity(source: object): ClientDbEntity;
    domainToDbEntity(source: Client): ClientDbEntity;
    dbEntityToDomain(source: ClientDbEntity): Client;
}

export default IClientMapper;