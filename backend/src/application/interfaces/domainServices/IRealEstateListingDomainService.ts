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
    squareMeters: number;
    yearBuilt: number;
    bathroomNumber: number;
    bedroomNumber: number;
    description: string;
    flooringType: string;
    title: string;
    images: string[];
}

export interface OrchestrateUpdateListingContract {
    type: string;
    price: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    clientId: ClientId;
    squareMeters: number;
    yearBuilt: number;
    bathroomNumber: number;
    bedroomNumber: number;
    description: string;
    flooringType: string;
    title: string;
    images: string[];
}

export default interface IRealEstateListingDomainService {
    tryOrchestractCreateNewListing(contract: OrchestrateCreateNewListingContract): Promise<Result<RealEstateListing, ApplicationError>>;
    tryOrchestractUpdateListing(listing: RealEstateListing, contract: OrchestrateUpdateListingContract): Promise<Result<boolean, ApplicationError>>;
    tryGetById(id: string): Promise<Result<RealEstateListing, ApplicationError>>;
}
