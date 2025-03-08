import RealEstateListing from "domain/entities/RealEstateListing";
import ClientId from "domain/valueObjects/Client/ClientId";
import Money from "domain/valueObjects/Common/Money";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

export class FilterRealEstateListingsCriteria {
    constructor(params: {
        type?: RealEstateListingType | null;
        minPrice?: Money | null;
        maxPrice?: Money | null;
        country?: string | null;
        state?: string | null;
        city?: string | null;
        zip?: string | null;
        clientId?: ClientId | null;
    }) {
        this.type = params.type ?? null;
        this.minPrice = params.minPrice ?? null;
        this.maxPrice = params.maxPrice ?? null;
        this.country = params.country ?? null;
        this.state = params.state ?? null;
        this.city = params.city ?? null;
        this.zip = params.zip ?? null;
        this.clientId = params.clientId ?? null;
    }
    type: RealEstateListingType | null;
    minPrice: Money | null;
    maxPrice: Money | null;
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
    clientId: ClientId | null;

    equal(other: unknown) {
        if (!(other instanceof FilterRealEstateListingsCriteria)) return false;
        return (
            this.type?.equals(other.type) === true &&
            this.minPrice?.equals(other.minPrice) === true &&
            this.maxPrice?.equals(other.maxPrice) === true &&
            this.country === other.country &&
            this.state === other.state &&
            this.city === other.city &&
            this.zip === other.zip &&
            this.clientId?.equals(other.clientId) === true
        )
    }
}

interface IRealEstateListingRepository {
    createAsync: (listing: RealEstateListing) => Promise<void>;
    updateAsync: (listing: RealEstateListing) => Promise<void>;
    getByIdAsync: (id: RealEstateListingId) => Promise<RealEstateListing | null>;
    deleteAsync: (listing: RealEstateListing) => Promise<void>;
    filterAsync: (criteria: FilterRealEstateListingsCriteria) => Promise<RealEstateListing[]>;
}

export default IRealEstateListingRepository;
