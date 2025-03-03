import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import ApplicationError from "application/errors/ApplicationError";
import { err, ok, Result } from "neverthrow";
import IRealEstateListingDomainService, { OrchestrateCreateNewListingContract } from "application/interfaces/domainServices/IRealEstateListingDomainService";
import RealEstateListing, { CreateRealEstateListingContract } from "domain/entities/RealEstateListing";
import CannotCreateRealEstateListingsError from "application/errors/domain/realEstateListings/CannotCreateRealEstateListingsError";

class RealEstateListingDomainService implements IRealEstateListingDomainService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async tryOrchestractCreateNewListing(contract: OrchestrateCreateNewListingContract): Promise<Result<RealEstateListing, ApplicationError>> {
        const createClientContract: CreateRealEstateListingContract = {
            city: contract.city,
            clientId: contract.clientId,
            country: contract.country,
            dateCreated: new Date(),
            id: contract.id,
            price: contract.price,
            state: contract.state,
            street: contract.street,
            type: contract.type,
            zip: contract.zip,
        };

        const canCreateListing = RealEstateListing.canCreate(createClientContract);
        if (canCreateListing.isError()) return err(new CannotCreateRealEstateListingsError({ message: canCreateListing.error.message, path: [] }));
    
        const listing = RealEstateListing.executeCreate(createClientContract);
        await this.unitOfWork.clientRepo.createAsync(listing);

        return ok(listing);
    }
}

export default RealEstateListingDomainService;
