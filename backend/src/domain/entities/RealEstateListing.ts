import { DomainResult } from "domain/errors/TDomainResult";
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

    public canCreate(contract: CreateRealEstateListingContract): DomainResult {
        const id = RealEstateListingId.canCreate(contract.id);
        if (id.isError) return DomainResult.fromError(id.error);

        const type = RealEstateListingType.canCreate(contract.type);
        if (type.isError) return DomainResult.fromError(type.error);

        const price = Money.canCreate(contract.price);
        if (price.isError) return DomainResult.fromError(price.error);

        const address = RealEstateListingAddress.canCreate({ street: contract.street, city: contract.city, state: contract.state, zip: contract.zip, country: contract.country });
        if (address.isError) return DomainResult.fromError(address.error);

        return DomainResult.OK;
    }

    public executeCreate(contract: CreateRealEstateListingContract) {
        const canCreate = this.canCreate(contract);
        if (canCreate.isError) throw new Error(canCreate.error.message);

        const id = RealEstateListingId.executeCreate(contract.id);
        const type = RealEstateListingType.executeCreate(contract.type);
        const price = Money.executeCreate(contract.price);
        const address = RealEstateListingAddress.executeCreate({ street: contract.street, city: contract.city, state: contract.state, zip: contract.zip, country: contract.country });

        return new RealEstateListing(id, type, price, address, contract.clientId);
    }
}

export default RealEstateListing;
