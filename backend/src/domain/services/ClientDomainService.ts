import IClientDomainService, { IOrchestrateCreateNewClientContract } from "application/interfaces/domainServices/IClientDomainService";
import IUnitOfWork from "application/interfaces/IUnitOfWork";
import Client, { CreateClientContract } from "domain/entities/Client";
import CannotCreateClientError from "domain/errors/client/CannotCreateClientError";
import DomainError from "domain/errors/DomainError";
import { err, ok, Result } from "neverthrow";

class ClientDomainService implements IClientDomainService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}
    
    async tryOrchestractCreateNewClient(contract: IOrchestrateCreateNewClientContract): Promise<Result<Client, DomainError>> {
        const createClientContract: CreateClientContract = { id: contract.name, name: contract.name, type: contract.type };
        
        const canCreateClient = Client.canCreate(createClientContract);
        if (canCreateClient.isErr()) return err(new CannotCreateClientError({ message: canCreateClient.error.message, path: [] }));

        const client = Client.executeCreate(createClientContract);
        await this.unitOfWork.clientRepo.createAsync(client);

        return ok(client);
    }
    
}

export default ClientDomainService;
