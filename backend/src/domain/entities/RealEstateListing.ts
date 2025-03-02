import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";
import REAL_ESTATE_LISTING_ERROR_CODES from "domain/errors/enums/REAL_ESTATE_LISTING_ERROR_CODES";
import ClientId from "domain/valueObjects/Client/ClientId";
import Money from "domain/valueObjects/Common/Money";
import RealEstateListingAddress from "domain/valueObjects/RealEstateListing/RealEstateListingAddress";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

interface CreateRealEstateListingContract {
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

class RealEstateListing {
    private readonly __type: "RealEstateListing" = null!;

    private constructor(
        public id: RealEstateListingId,
        public type: RealEstateListingType,
        public price: Money,
        public address: RealEstateListingAddress,
        public clientId: ClientId
    ) {}

    public canCreate(contract: CreateRealEstateListingContract): DomainValidationResult {
        const id = RealEstateListingId.canCreate(contract.id);
        if (id.isError()) return DomainValidationResult.AsError({ message: id.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_ID });

        const type = RealEstateListingType.canCreate(contract.type);
        if (type.isError()) return DomainValidationResult.AsError({ message: type.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_TYPE });

        const price = Money.canCreate(contract.price);
        if (price.isError()) return DomainValidationResult.AsError({ message: price.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_PRICE });

        const address = RealEstateListingAddress.canCreate({ street: contract.street, city: contract.city, state: contract.state, zip: contract.zip, country: contract.country });
        if (address.isError()) return DomainValidationResult.AsError({ message: address.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_ADDRESS });

        return DomainValidationResult.AsOk();
    }

    public executeCreate(contract: CreateRealEstateListingContract) {
        const canCreate = this.canCreate(contract);
        if (canCreate.isError()) throw new Error(canCreate.error.message);

        const id = RealEstateListingId.executeCreate(contract.id);
        const type = RealEstateListingType.executeCreate(contract.type);
        const price = Money.executeCreate(contract.price);
        const address = RealEstateListingAddress.executeCreate({ street: contract.street, city: contract.city, state: contract.state, zip: contract.zip, country: contract.country });

        return new RealEstateListing(id, type, price, address, contract.clientId);
    }
}

export default RealEstateListing;
