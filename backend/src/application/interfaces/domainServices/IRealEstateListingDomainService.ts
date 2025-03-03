import ApplicationError from "application/errors/ApplicationError";
import { Result } from "neverthrow";
import RealEstateListing from "domain/entities/RealEstateListing";
import ClientId from "domain/valueObjects/Client/ClientId";

export interface OrchestrateCreateNewListingContract {
    id: string;
    type: string;
    price: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    clientId: ClientId;
} 

export default interface IRealEstateListingDomainService {
    tryOrchestractCreateNewListing(contract: OrchestrateCreateNewListingContract): Promise<Result<RealEstateListing, ApplicationError>>
}