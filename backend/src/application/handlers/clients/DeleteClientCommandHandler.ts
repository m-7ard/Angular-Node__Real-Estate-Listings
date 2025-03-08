import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import ApplicationError from "application/errors/ApplicationError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";

export type DeleteClientCommandResult = ICommandResult<ApplicationError[]>;

export class DeleteClientCommand implements ICommand<DeleteClientCommandResult> {
    __returnType: DeleteClientCommandResult = null!;

    constructor({ id, force }: { id: string; force: boolean; }) {
        this.id = id;
        this.force = force;
    }

    public id: string;
    public force: boolean;
}

export default class DeleteClientCommandHandler implements IRequestHandler<DeleteClientCommand, DeleteClientCommandResult> {
    constructor(private readonly unitOfWork: IUnitOfWork, private readonly clientDomainService: IClientDomainService, private readonly realEstateListingDomainService: IRealEstateListingDomainService) {}

    async handle(command: DeleteClientCommand): Promise<DeleteClientCommandResult> {
        try {
            // Client Exists
            const clientExists = await this.clientDomainService.tryGetById(command.id);
            if (clientExists.isErr()) return err(new ClientDoesNotExistError({ message: clientExists.error.message }).asList());

            const client = clientExists.value;

            // Get Client's Listings
            const listings = await this.unitOfWork.realEstateListingRepo.filterAsync(new FilterRealEstateListingsCriteria({ clientId: client.id }));

            // Delete
            if (listings.length > 0) {
                if (command.force) {
                    for (let i = 0; i < listings.length; i++) {
                        const listing = listings[i];
                        await this.unitOfWork.realEstateListingRepo.deleteAsync(listing);
                    }
                } else {
                    return err(new ClientDoesNotExistError({ message: `Cannot delete a Client while they have existing Real Estate Listings (Amount: ${listings.length})` }).asList());
                }
            }

            await this.unitOfWork.clientRepo.deleteAsync(client);

            await this.unitOfWork.commitTransaction();
            
            return ok(undefined);
        } finally {
            await this.unitOfWork.rollbackTransaction();
        }
    }
}
