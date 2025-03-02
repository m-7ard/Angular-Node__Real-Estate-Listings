import Client from "domain/entities/Client";
import ApplicationError from "application/errors/ApplicationError";
import { Result } from "neverthrow";

export interface IOrchestrateCreateNewClientContract {
    id: string;
    name: string;
    type: string;
} 

export default interface IClientDomainService {
    tryOrchestractCreateNewClient(contract: IOrchestrateCreateNewClientContract): Promise<Result<Client, ApplicationError>>
}