import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";
import CLIENT_ERROR_CODES from "domain/errors/enums/CLIENT_ERROR_CODES";
import ClientId from "domain/valueObjects/Client/ClientId";
import ClientType from "domain/valueObjects/Client/ClientType";

export interface CreateClientContract {
    id: string;
    type: string;
    name: string;
}

export interface UpdateClientContract {
    id: string;
    type: string;
    name: string;
}

export default class Client {
    private constructor(public id: ClientId, public type: ClientType, public name: string) {}

    public static canCreate(contract: CreateClientContract): DomainValidationResult {
        const id = ClientId.canCreate(contract.id);
        if (id.isErr()) return DomainValidationResult.AsError({ code: CLIENT_ERROR_CODES.INVALID_ID, message: id.error });

        const type = ClientType.canCreate(contract.type); 
        if (type.isErr()) return DomainValidationResult.AsError({ code: CLIENT_ERROR_CODES.INVALID_TYPE, message: type.error });

        return DomainValidationResult.AsOk();
    }

    public static executeCreate(contract: CreateClientContract) {
        const canCreate = this.canCreate(contract);
        if (canCreate.isError()) throw canCreate.error;
        
        const id = ClientId.executeCreate(contract.id);
        const type = ClientType.executeCreate(contract.type); 

        return new Client(id, type, contract.name);
    }

    public canUpdate(contract: UpdateClientContract): DomainValidationResult {
        const id = ClientId.canCreate(contract.id);
        if (id.isErr()) return DomainValidationResult.AsError({ code: CLIENT_ERROR_CODES.INVALID_ID, message: id.error });

        const type = ClientType.canCreate(contract.type); 
        if (type.isErr()) return DomainValidationResult.AsError({ code: CLIENT_ERROR_CODES.INVALID_TYPE, message: type.error });

        return DomainValidationResult.AsOk();
    }

    public executeUpdate(contract: UpdateClientContract) {
        const canUpdate = this.canUpdate(contract);
        if (canUpdate.isError()) throw canUpdate.error;
        
        const id = ClientId.executeCreate(contract.id);
        const type = ClientType.executeCreate(contract.type); 

        return new Client(id, type, contract.name);
    }
}