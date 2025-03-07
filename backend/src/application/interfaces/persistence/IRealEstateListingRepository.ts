import RealEstateListing from "domain/entities/RealEstateListing";
import ClientId from "domain/valueObjects/Client/ClientId";
import Money from "domain/valueObjects/Common/Money";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

export interface FilterRealEstateListingsCriteria {
    type: RealEstateListingType | null;
    minPrice: Money | null;
    maxPrice: Money | null;
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
    clientId: ClientId | null;
}

interface IRealEstateListingRepository {
    createAsync: (listing: RealEstateListing) => Promise<void>;
    updateAsync: (listing: RealEstateListing) => Promise<void>;
    getByIdAsync: (id: RealEstateListingId) => Promise<RealEstateListing | null>;
    deleteAsync: (listing: RealEstateListing) => Promise<void>;
    filterAsync: (criteria: FilterRealEstateListingsCriteria) => Promise<RealEstateListing[]>;
}

export default IRealEstateListingRepository;
