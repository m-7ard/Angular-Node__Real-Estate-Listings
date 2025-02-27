import Client from "domain/entities/Client"
import ClientDbEntity from "infrastructure/dbEntities/ClientDbEntity"
import IMySQLClientSchema from "infrastructure/dbSchemas/MySQL/IMySQLClientSchema"

interface IMySQLClientMapper {
    schemaToDbEntity(source: IMySQLClientSchema): ClientDbEntity;
    domainToDbEntity(source: Client): ClientDbEntity;
    dbEntityToDomain(source: ClientDbEntity): Client;
}

export default IMySQLClientMapper;