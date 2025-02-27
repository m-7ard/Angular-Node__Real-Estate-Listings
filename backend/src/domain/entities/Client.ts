import CannotCreateClientId from "domain/errors/client/valueObjects/CannotCreateClientId";
import CannotCreateClientType from "domain/errors/client/valueObjects/CannotCreateClientType";
import DomainError from "domain/errors/DomainError";
import ClientId from "domain/valueObjects/Client/ClientId";
import ClientType from "domain/valueObjects/Client/ClientType";
import { err, ok, Result } from "neverthrow";

export interface CreateClientContract {
    id: string;
    type: string;
    name: string;
}

export default class Client {
    private constructor(public id: ClientId, public type: ClientType, public name: string) {}

    public static canCreate(contract: CreateClientContract): Result<true, DomainError> {
        const id = ClientId.canCreate(contract.id);
        if (id.isErr()) return err(new CannotCreateClientId({ message: id.error }))

        const type = ClientType.canCreate(contract.type); 
        if (type.isErr()) return err(new CannotCreateClientType({ message: type.error }));

        return ok(true);
    }

    public static executeCreate(contract: CreateClientContract) {
        const canCreate = this.canCreate(contract);
        if (canCreate.isErr()) throw canCreate.error;
        
        const id = ClientId.executeCreate(contract.id);
        const type = ClientType.executeCreate(contract.type); 

        return new Client(id, type, contract.name);
    }
}