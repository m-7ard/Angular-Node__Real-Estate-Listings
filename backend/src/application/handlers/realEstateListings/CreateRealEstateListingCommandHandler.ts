import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import ApplicationError from "application/errors/ApplicationError";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import CannotCreateNewListingServiceError from "application/errors/services/realEstateListingDomainService/CannotCreateNewListingServiceError";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";

export type CreateRealEstateListingCommandResult = ICommandResult<ApplicationError[]>;

export class CreateRealEstateListingCommand implements ICommand<CreateRealEstateListingCommandResult> {
    __returnType: CreateRealEstateListingCommandResult = null!;

    constructor(params: {
        id: string;
        type: string;
        price: number;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        clientId: string;
        info: {
            squareMeters: number;
            yearBuilt: number;
            bathroomNumber: number;
            bedroomNumber: number;
            description: string;
            flooringType: string;
        };
        title: string;
    }) {
        this.id = params.id;
        this.type = params.type;
        this.price = params.price;
        this.street = params.street;
        this.city = params.city;
        this.state = params.state;
        this.zip = params.zip;
        this.country = params.country;
        this.clientId = params.clientId;
        this.info = params.info;
        this.title = params.title;
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
    info: {
        squareMeters: number;
        yearBuilt: number;
        bathroomNumber: number;
        bedroomNumber: number;
        description: string;
        flooringType: string;
    };
    title: string;
}

export default class CreateRealEstateListingCommandHandler implements IRequestHandler<CreateRealEstateListingCommand, CreateRealEstateListingCommandResult> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly realEstateListingDomainService: IRealEstateListingDomainService,
        private readonly clientDomainService: IClientDomainService,
    ) {}

    async handle(command: CreateRealEstateListingCommand): Promise<CreateRealEstateListingCommandResult> {
        // Client Exists
        const clientExists = await this.clientDomainService.tryGetById(command.clientId);
        if (clientExists.isErr()) return err(new ClientDoesNotExistError({ message: clientExists.error.message }).asList());

        const client = clientExists.value;

        // Try Create New
        const createResult = await this.realEstateListingDomainService.tryOrchestractCreateNewListing({
            id: command.id,
            city: command.city,
            clientId: client.id,
            country: command.country,
            price: command.price,
            state: command.state,
            street: command.street,
            type: command.type,
            zip: command.zip,
            squareMeters: command.info.squareMeters,
            yearBuilt: command.info.yearBuilt,
            bathroomNumber: command.info.bathroomNumber,
            bedroomNumber: command.info.bedroomNumber,
            description: command.info.description,
            flooringType: command.info.flooringType,
            title: command.title,
        });
        if (createResult.isErr()) return err(new CannotCreateNewListingServiceError({ message: createResult.error.message }).asList());

        await this.unitOfWork.commitTransaction();
        return ok(undefined);
    }
}
