import { IRequestHandler } from "../IRequestHandler";
import { err, ok } from "neverthrow";
import ApplicationError from "application/errors/ApplicationError";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IQuery, { IQueryResult } from "../IQuery";
import RealEstateListing from "domain/entities/RealEstateListing";

export type ReadRealEstateListingQueryResult = IQueryResult<RealEstateListing | null, ApplicationError[]>;

export class ReadRealEstateListingQuery implements IQuery<ReadRealEstateListingQueryResult> {
    __returnType: ReadRealEstateListingQueryResult = null!;

    constructor(params: { 
        id: string;
    }) {
        this.id = params.id;
    }

    id: string;
}

export default class ReadRealEstateListingQueryHandler implements IRequestHandler<ReadRealEstateListingQuery, ReadRealEstateListingQueryResult> {
    constructor(private readonly realEstateListingDomainService: IRealEstateListingDomainService) {}

    async handle(command: ReadRealEstateListingQuery): Promise<ReadRealEstateListingQueryResult> {
        // Listing Exists
        const listingExists = await this.realEstateListingDomainService.tryGetById(command.id);
        if (listingExists.isErr()) return ok(null);

        const listing = listingExists.value;

        return ok(listing);
    }
}
