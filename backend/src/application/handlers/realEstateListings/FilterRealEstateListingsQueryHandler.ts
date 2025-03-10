import { IRequestHandler } from "../IRequestHandler";
import { ok } from "neverthrow";
import ApplicationError from "application/errors/ApplicationError";
import IQuery, { IQueryResult } from "../IQuery";
import RealEstateListing from "domain/entities/RealEstateListing";
import IRealEstateListingRepository, { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";
import ClientId from "domain/valueObjects/Client/ClientId";
import Money from "domain/valueObjects/Common/Money";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

export type FilterRealEstateListingsQueryResult = IQueryResult<RealEstateListing[], ApplicationError[]>;

export class FilterRealEstateListingsQuery implements IQuery<FilterRealEstateListingsQueryResult> {
    __returnType: FilterRealEstateListingsQueryResult = null!;

    constructor(params: {
        type?: string | null;
        minPrice?: number | null;
        maxPrice?: number | null;
        country?: string | null;
        state?: string | null;
        city?: string | null;
        zip?: string | null;
        clientId?: string | null;
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

    type: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    country: string | null;
    state: string | null;
    city: string | null;
    zip: string | null;
    clientId: string | null;
}

export default class FilterRealEstateListingsQueryHandler implements IRequestHandler<FilterRealEstateListingsQuery, FilterRealEstateListingsQueryResult> {
    constructor(private readonly realEstateListingRepository: IRealEstateListingRepository) {}

    async handle(query: FilterRealEstateListingsQuery): Promise<FilterRealEstateListingsQueryResult> {
        // Clean Input
        if (query.clientId != null && ClientId.canCreate(query.clientId).isErr()) {
            query.clientId = null;
        }

        if (query.maxPrice != null && Money.canCreate(query.maxPrice).isError()) {
            query.maxPrice = null;
        }

        if (query.minPrice != null && Money.canCreate(query.minPrice).isError()) {
            query.minPrice = null;
        }

        if (query.type != null && RealEstateListingType.canCreate(query.type).isError()) {
            query.type = null;
        }

        if (query.minPrice != null && query.maxPrice != null && query.maxPrice < query.minPrice) {
            query.minPrice = null;
            query.maxPrice = null;
        }

        // Lookup
        const criteria = new FilterRealEstateListingsCriteria({
            city: query.city,
            clientId: query.clientId == null ? null : ClientId.executeCreate(query.clientId),
            country: query.country,
            maxPrice: query.maxPrice == null ? null : Money.executeCreate(query.maxPrice),
            minPrice: query.minPrice == null ? null : Money.executeCreate(query.minPrice),
            state: query.state,
            type: query.type == null ? null : RealEstateListingType.executeCreate(query.type),
            zip: query.zip,
        });
        
        const listings = await this.realEstateListingRepository.filterAsync(criteria);

        return ok(listings);
    }
}
