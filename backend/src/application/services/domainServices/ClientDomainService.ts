import IClientDomainService, { IOrchestrateCreateNewClientContract, IOrchestrateUpdateClientContract } from "application/interfaces/domainServices/IClientDomainService";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import Client, { CreateClientContract, UpdateClientContract } from "domain/entities/Client";
import CannotCreateClientError from "application/errors/domain/client/CannotCreateClientError";
import ApplicationError from "application/errors/ApplicationError";
import { err, ok, Result } from "neverthrow";
import ClientId from "domain/valueObjects/Client/ClientId";
import CannotCreateClientIdError from "application/errors/domain/client/valueObjects/CannotCreateClientIdError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import CannotUpdateClient from "application/errors/services/clientDomainService/CannotUpdateClient";

class ClientDomainService implements IClientDomainService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}
    
    async tryOrchestractCreateNewClient(contract: IOrchestrateCreateNewClientContract): Promise<Result<Client, ApplicationError>> {
        const createClientContract: CreateClientContract = { id: contract.id, name: contract.name, type: contract.type };
        
        const canCreateClient = Client.canCreate(createClientContract);
        if (canCreateClient.isError()) return err(new CannotCreateClientError({ message: canCreateClient.error.message, path: [] }));

        const client = Client.executeCreate(createClientContract);
        await this.unitOfWork.clientRepo.createAsync(client);

        return ok(client);
    }
    
    async tryGetById(id: string): Promise<Result<Client, ApplicationError>> {
        // Create Client Id
        const createClientId = ClientId.canCreate(id);
        if (createClientId.isErr()) return err(new CannotCreateClientIdError({ message: createClientId.error }));

        const clientId = ClientId.executeCreate(id);

        // Fetch Client
        const client = await this.unitOfWork.clientRepo.getByIdAsync(clientId);
        if (client == null) return err(new ClientDoesNotExistError({ message: `Client of Id "${id}" does not exist.` }));
        
        return ok(client);
    }
    
    async tryOrchestractUpdateClient(client: Client, contract: IOrchestrateUpdateClientContract): Promise<Result<boolean, ApplicationError>> {
        // Can Update
        const canUpdateContract: UpdateClientContract = { "id": client.id.value, "name": contract.name, "type": contract.type };
        const canUpdate = client.canUpdate(canUpdateContract);

        if (canUpdate.isError()) return err(new CannotUpdateClient({ message: canUpdate.error.message }));
    
        // Execute Update
        client.executeUpdate(canUpdateContract);

        // Persist
        await this.unitOfWork.clientRepo.updateAsync(client);

        return ok(true);
    }
}

export default ClientDomainService;
