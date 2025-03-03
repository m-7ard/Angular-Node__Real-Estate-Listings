import RealEstateListing from "domain/entities/RealEstateListing";

interface IRealEstateListingRepository {
    createAsync: (listing: RealEstateListing) => Promise<void>;
}

export default IRealEstateListingRepository;
