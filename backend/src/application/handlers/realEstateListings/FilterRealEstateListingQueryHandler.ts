import { IRequestHandler } from "../IRequestHandler";
import { ok } from "neverthrow";
import ApplicationError from "application/errors/ApplicationError";
import IQuery, { IQueryResult } from "../IQuery";
import RealEstateListing from "domain/entities/RealEstateListing";
import IRealEstateListingRepository, { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";
import ClientId from "domain/valueObjects/Client/ClientId";
import Money from "domain/valueObjects/Common/Money";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

export type FilterRealEstateListingQueryResult = IQueryResult<RealEstateListing[], ApplicationError[]>;

export class FilterRealEstateListingQuery implements IQuery<FilterRealEstateListingQueryResult> {
    __returnType: FilterRealEstateListingQueryResult = null!;

    constructor(params: { 
        type: string | null;
        minPrice: number | null;
        maxPrice: number | null;
        country: string | null;
        state: string | null;
        city: string | null;
        zip: string | null;
        clientId: string | null;
    }) {
        this.type = params.type;
        this.minPrice = params.minPrice;
        this.maxPrice = params.maxPrice;
        this.country = params.country;
        this.state = params.state;
        this.city = params.city;
        this.zip = params.zip;
        this.clientId = params.clientId;
    }

    type: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
    clientId: string | null;
}

export default class FilterRealEstateListingQueryHandler implements IRequestHandler<FilterRealEstateListingQuery, FilterRealEstateListingQueryResult> {
    constructor(private readonly realEstateListingRepository: IRealEstateListingRepository) {}

    async handle(command: FilterRealEstateListingQuery): Promise<FilterRealEstateListingQueryResult> {
        // Clean Input
        if (command.clientId != null && !ClientId.canCreate(command.clientId)) {
            command.clientId = null
        }

        if (command.maxPrice != null && !Money.canCreate(command.maxPrice)) {
            command.maxPrice = null
        }

        if (command.minPrice != null && !Money.canCreate(command.minPrice)) {
            command.minPrice = null
        }
        
        if (command.type != null && !RealEstateListingType.canCreate(command.type)) {
            command.type = null
        }

        if ((command.minPrice != null && command.maxPrice != null) && (command.maxPrice < command.minPrice)) {
            command.minPrice = null;
            command.maxPrice = null;
        }

        const criteria: FilterRealEstateListingsCriteria = { 
            "city": command.city, 
            "clientId": command.clientId == null ? null : ClientId.executeCreate(command.clientId),
            "country": command.country,
            "maxPrice": command.maxPrice == null ? null : Money.executeCreate(command.maxPrice),
            "minPrice": command.minPrice == null ? null : Money.executeCreate(command.minPrice),
            "state": command.state,
            "type": command.type == null ? null : RealEstateListingType.executeCreate(command.type),
            "zip": command.zip
        }

        // Lookup
        const listings = await this.realEstateListingRepository.filterAsync(criteria);

        return ok(listings);
    }
}
