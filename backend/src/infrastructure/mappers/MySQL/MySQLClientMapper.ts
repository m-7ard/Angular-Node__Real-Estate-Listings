import ClientDbEntity from "infrastructure/dbEntities/ClientDbEntity";
import IMySQLClientSchema from "infrastructure/dbSchemas/MySQL/IMySQLClientSchema";
import Client from "domain/entities/Client";
import IClientMapper from "../interfaces/IClientMapper";

class MySQLClientMapper implements IClientMapper {
    schemaToDbEntity(source: IMySQLClientSchema): ClientDbEntity {
        return new ClientDbEntity({ id: source.id, name: source.name, type: source.type });
    }

    domainToDbEntity(source: Client): ClientDbEntity {
        return new ClientDbEntity({ id: source.id.value, name: source.name, type: source.type.value });
    }

    dbEntityToDomain(source: ClientDbEntity): Client {
        return Client.executeCreate({ id: source.id, name: source.name, type: source.type });
    }
}

export default MySQLClientMapper;
