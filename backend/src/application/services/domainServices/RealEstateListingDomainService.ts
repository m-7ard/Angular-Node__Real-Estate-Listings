import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import ApplicationError from "application/errors/ApplicationError";
import { err, ok, Result } from "neverthrow";
import IRealEstateListingDomainService, { OrchestrateCreateNewListingContract, OrchestrateUpdateListingContract } from "application/interfaces/domainServices/IRealEstateListingDomainService";
import RealEstateListing, { CreateRealEstateListingContract, UpdateRealEstateListingContract } from "domain/entities/RealEstateListing";
import CannotCreateRealEstateListingError from "application/errors/domain/realEstateListings/CannotCreateRealEstateListingError";
import CannotUpdateRealEstateListingError from "application/errors/domain/realEstateListings/CannotUpdateRealEstateListingError";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import CannotCreateRealEstateListingIdError from "application/errors/domain/realEstateListings/valueObjects/CannotCreateRealEstateListingIdError";
import RealEstateListingDoesNotExistError from "application/errors/application/realEstateListings/RealEstateListingDoesNotExistError";

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
            squareMeters: contract.squareMeters,
            yearBuilt: contract.yearBuilt,
            bathroomNumber: contract.bathroomNumber,
            bedroomNumber: contract.bedroomNumber,
            description: contract.description,
            flooringType: contract.flooringType,
            title: contract.title,
            images: contract.images
        };

        const canCreateListing = RealEstateListing.canCreate(createClientContract);
        if (canCreateListing.isError()) return err(new CannotCreateRealEstateListingError({ message: canCreateListing.error.message, path: [] }));

        const listing = RealEstateListing.executeCreate(createClientContract);
        await this.unitOfWork.realEstateListingRepo.createAsync(listing);

        return ok(listing);
    }

    async tryOrchestractUpdateListing(listing: RealEstateListing, contract: OrchestrateUpdateListingContract): Promise<Result<boolean, ApplicationError>> {
        const updateContract: UpdateRealEstateListingContract = {
            city: contract.city,
            clientId: contract.clientId,
            country: contract.country,
            id: listing.id.value,
            price: contract.price,
            state: contract.state,
            street: contract.street,
            type: contract.type,
            zip: contract.zip,
            squareMeters: contract.squareMeters,
            yearBuilt: contract.yearBuilt,
            bathroomNumber: contract.bathroomNumber,
            bedroomNumber: contract.bedroomNumber,
            description: contract.description,
            flooringType: contract.flooringType,
            title: contract.title,
            images: contract.images
        };
        const canUpdate = listing.canUpdate(updateContract);

        if (canUpdate.isError()) return err(new CannotUpdateRealEstateListingError({ message: canUpdate.error.message }));

        listing.executeUpdate(updateContract);
        await this.unitOfWork.realEstateListingRepo.updateAsync(listing);
        return ok(true);
    }

    async tryGetById(id: string): Promise<Result<RealEstateListing, ApplicationError>> {
        // Create Client Id
        const createClientId = RealEstateListingId.canCreate(id);
        if (createClientId.isError()) return err(new CannotCreateRealEstateListingIdError({ message: createClientId.error.message }));

        const clientId = RealEstateListingId.executeCreate(id);

        // Fetch Listing
        const listing = await this.unitOfWork.realEstateListingRepo.getByIdAsync(clientId);
        if (listing == null) return err(new RealEstateListingDoesNotExistError({ message: `Real Estate of Id "${id} does not exist."` }));

        return ok(listing);
    }
}

export default RealEstateListingDomainService;
