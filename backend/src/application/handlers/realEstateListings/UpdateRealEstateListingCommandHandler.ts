import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import ApplicationError from "application/errors/ApplicationError";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import RealEstateListingDoesNotExistError from "application/errors/application/realEstateListings/RealEstateListingDoesNotExistError";
import CannotUpdateListingServiceError from "application/errors/services/realEstateListingDomainService/CannotUpdateListingServiceError";

export type UpdateRealEstateListingCommandResult = ICommandResult<ApplicationError[]>;

export class UpdateRealEstateListingCommand implements ICommand<UpdateRealEstateListingCommandResult> {
    __returnType: UpdateRealEstateListingCommandResult = null!;

    constructor(params: { id: string; type: string; price: number; street: string; city: string; state: string; zip: string; country: string; clientId: string }) {
        this.id = params.id;
        this.type = params.type;
        this.price = params.price;
        this.street = params.street;
        this.city = params.city;
        this.state = params.state;
        this.zip = params.zip;
        this.country = params.country;
        this.clientId = params.clientId;
    }

    id: string;
    type: string;
    price: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    clientId: string;
}

export default class UpdateRealEstateListingCommandHandler implements IRequestHandler<UpdateRealEstateListingCommand, UpdateRealEstateListingCommandResult> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly realEstateListingDomainService: IRealEstateListingDomainService,
        private readonly clientDomainService: IClientDomainService,
    ) {}

    async handle(command: UpdateRealEstateListingCommand): Promise<UpdateRealEstateListingCommandResult> {
        // Listing Exists
        const listingExists = await this.realEstateListingDomainService.tryGetById(command.id);
        if (listingExists.isErr()) return err(new RealEstateListingDoesNotExistError({ message: listingExists.error.message }).asList());

        const listing = listingExists.value;

        // Client Exists
        const clientExists = await this.clientDomainService.tryGetById(command.clientId);
        if (clientExists.isErr()) return err(new ClientDoesNotExistError({ message: clientExists.error.message }).asList());

        const client = clientExists.value;

        // Try Update
        const updateResult = await this.realEstateListingDomainService.tryOrchestractUpdateListing(listing, {
            city: command.city,
            clientId: client.id,
            country: command.country,
            price: command.price,
            state: command.state,
            street: command.street,
            type: command.type,
            zip: command.zip,
        });
        if (updateResult.isErr()) return err(new CannotUpdateListingServiceError({ message: updateResult.error.message }).asList());

        await this.unitOfWork.commitTransaction();
        return ok(undefined);
    }
}
