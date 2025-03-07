import Client from "domain/entities/Client";
import ApplicationError from "application/errors/ApplicationError";
import { Result } from "neverthrow";

export interface IOrchestrateCreateNewClientContract {
    id: string;
    name: string;
    type: string;
} 

export interface IOrchestrateUpdateClientContract {
    name: string;
    type: string;
} 

export default interface IClientDomainService {
    tryOrchestractCreateNewClient(contract: IOrchestrateCreateNewClientContract): Promise<Result<Client, ApplicationError>>
    tryOrchestractUpdateClient(client: Client, contract: IOrchestrateUpdateClientContract): Promise<Result<boolean, ApplicationError>>
    tryGetById(id: string): Promise<Result<Client, ApplicationError>>;
}