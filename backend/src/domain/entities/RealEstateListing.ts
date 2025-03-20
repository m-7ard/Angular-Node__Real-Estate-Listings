import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";
import REAL_ESTATE_LISTING_ERROR_CODES from "domain/errors/enums/REAL_ESTATE_LISTING_ERROR_CODES";
import ClientId from "domain/valueObjects/Client/ClientId";
import Money from "domain/valueObjects/Common/Money";
import RealEstateListingAddress from "domain/valueObjects/RealEstateListing/RealEstateListingAddress";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import RealEstateListingInfo from "domain/valueObjects/RealEstateListing/RealEstateListingInfo";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

export interface CreateRealEstateListingContract {
    id: string;
    type: string;
    price: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    clientId: ClientId;
    dateCreated: Date;
    squareMeters: number;
    yearBuilt: number;
    bathroomNumber: number;
    bedroomNumber: number;
    description: string;
    flooringType: string;
    title: string;
}

export interface UpdateRealEstateListingContract {
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
}

class RealEstateListing {
    private readonly __type: "RealEstateListing" = null!;
    public id: RealEstateListingId;
    public type: RealEstateListingType;
    public price: Money;
    public address: RealEstateListingAddress;
    public clientId: ClientId;
    public dateCreated: Date;
    public info: RealEstateListingInfo;
    public title: string;

    private constructor(params: {
        id: RealEstateListingId;
        type: RealEstateListingType;
        price: Money;
        address: RealEstateListingAddress;
        clientId: ClientId;
        dateCreated: Date;
        info: RealEstateListingInfo;
        title: string;
    }) {
        this.id = params.id;
        this.type = params.type;
        this.price = params.price;
        this.address = params.address;
        this.clientId = params.clientId;
        this.dateCreated = params.dateCreated;
        this.info = params.info;
        this.title = params.title;
    }

    public static canCreate(contract: CreateRealEstateListingContract): DomainValidationResult {
        const id = RealEstateListingId.canCreate(contract.id);
        if (id.isError()) return DomainValidationResult.AsError({ message: id.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_ID });

        const type = RealEstateListingType.canCreate(contract.type);
        if (type.isError()) return DomainValidationResult.AsError({ message: type.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_TYPE });

        const price = Money.canCreate(contract.price);
        if (price.isError()) return DomainValidationResult.AsError({ message: price.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_PRICE });

        const address = RealEstateListingAddress.canCreate({ street: contract.street, city: contract.city, state: contract.state, zip: contract.zip, country: contract.country });
        if (address.isError()) return DomainValidationResult.AsError({ message: address.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_ADDRESS });

        const info = RealEstateListingInfo.canCreate({
            bathroomNumber: contract.bathroomNumber,
            bedroomNumber: contract.bedroomNumber,
            description: contract.description,
            flooringType: contract.flooringType,
            squareMeters: contract.squareMeters,
            yearBuilt: contract.yearBuilt,
        });
        if (info.isError()) return DomainValidationResult.AsError({ message: info.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_INFO });

        return DomainValidationResult.AsOk();
    }

    public static executeCreate(contract: CreateRealEstateListingContract) {
        const canCreate = this.canCreate(contract);
        if (canCreate.isError()) throw new Error(canCreate.error.message);

        const id = RealEstateListingId.executeCreate(contract.id);
        const type = RealEstateListingType.executeCreate(contract.type);
        const price = Money.executeCreate(contract.price);
        const address = RealEstateListingAddress.executeCreate({ street: contract.street, city: contract.city, state: contract.state, zip: contract.zip, country: contract.country });
        const info = RealEstateListingInfo.executeCreate({
            bathroomNumber: contract.bathroomNumber,
            bedroomNumber: contract.bedroomNumber,
            description: contract.description,
            flooringType: contract.flooringType,
            squareMeters: contract.squareMeters,
            yearBuilt: contract.yearBuilt,
        });

        return new RealEstateListing({
            id: id,
            type: type,
            price: price,
            address: address,
            clientId: contract.clientId,
            dateCreated: contract.dateCreated,
            info: info,
            title: contract.title
        });
    }

    public canUpdate(contract: UpdateRealEstateListingContract): DomainValidationResult {
        const id = RealEstateListingId.canCreate(contract.id);
        if (id.isError()) return DomainValidationResult.AsError({ message: id.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_ID });

        const type = RealEstateListingType.canCreate(contract.type);
        if (type.isError()) return DomainValidationResult.AsError({ message: type.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_TYPE });

        const price = Money.canCreate(contract.price);
        if (price.isError()) return DomainValidationResult.AsError({ message: price.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_PRICE });

        const address = RealEstateListingAddress.canCreate({ street: contract.street, city: contract.city, state: contract.state, zip: contract.zip, country: contract.country });
        if (address.isError()) return DomainValidationResult.AsError({ message: address.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_ADDRESS });

        const info = RealEstateListingInfo.canCreate({
            bathroomNumber: contract.bathroomNumber,
            bedroomNumber: contract.bedroomNumber,
            description: contract.description,
            flooringType: contract.flooringType,
            squareMeters: contract.squareMeters,
            yearBuilt: contract.yearBuilt,
        });
        if (info.isError()) return DomainValidationResult.AsError({ message: info.error.message, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_INFO });

        return DomainValidationResult.AsOk();
    }

    public executeUpdate(contract: UpdateRealEstateListingContract) {
        const canUpdate = this.canUpdate(contract);
        if (canUpdate.isError()) throw new Error(canUpdate.error.message);

        this.id = RealEstateListingId.executeCreate(contract.id);
        this.type = RealEstateListingType.executeCreate(contract.type);
        this.price = Money.executeCreate(contract.price);
        this.address = RealEstateListingAddress.executeCreate({ street: contract.street, city: contract.city, state: contract.state, zip: contract.zip, country: contract.country });
        this.info = RealEstateListingInfo.executeCreate({
            bathroomNumber: contract.bathroomNumber,
            bedroomNumber: contract.bedroomNumber,
            description: contract.description,
            flooringType: contract.flooringType,
            squareMeters: contract.squareMeters,
            yearBuilt: contract.yearBuilt,
        });
    }
}

export default RealEstateListing;
