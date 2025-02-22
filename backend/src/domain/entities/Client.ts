import { DomainResult } from "domain/errors/TDomainResult";
import ClientId from "domain/valueObjects/Client/ClientId";
import ClientType from "domain/valueObjects/Client/ClientType";

interface CreateClientContract {
    id: string;
    type: string;
    name: string;
}

export default class Client {
    private constructor(public id: ClientId, public type: ClientType, public name: string) {}

    public canCreate(contract: CreateClientContract): DomainResult {
        const id = ClientId.canCreate(contract.id);
        if (id.isErr()) return DomainResult.fromError(id.error);

        const type = ClientType.canCreate(contract.type); 
        if (type.isErr()) return DomainResult.fromError(type.error);

        return DomainResult.OK;
    }

    public executeCreate(contract: CreateClientContract) {
        const canCreate = this.canCreate(contract);
        if (canCreate.isError) throw new Error(canCreate.error.message);
        
        const id = ClientId.executeCreate(contract.id);
        const type = ClientType.executeCreate(contract.type); 

        return new Client(id, type, contract.name);
    }
}