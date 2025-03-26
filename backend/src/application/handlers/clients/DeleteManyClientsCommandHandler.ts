import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import ApplicationError from "application/errors/ApplicationError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";
import CannotDeleteClientError from "application/errors/domain/client/CannotDeleteClientError";

export type DeleteManyClientsCommandResult = ICommandResult<ApplicationError[]>;

export class DeleteManyClientsCommand implements ICommand<DeleteManyClientsCommandResult> {
    __returnType: DeleteManyClientsCommandResult = null!;

    constructor({ ids, force }: { ids: string[]; force: boolean }) {
        this.ids = ids;
        this.force = force;
    }

    public ids: string[];
    public force: boolean;
}

export default class DeleteManyClientsCommandHandler implements IRequestHandler<DeleteManyClientsCommand, DeleteManyClientsCommandResult> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly clientDomainService: IClientDomainService,
    ) {}

    async handle(command: DeleteManyClientsCommand): Promise<DeleteManyClientsCommandResult> {
        const errors: ApplicationError[] = [];
        await this.unitOfWork.beginTransaction();

        for (let i = 0; i < command.ids.length; i++) {
            const id = command.ids[i];

            try {
                // Client Exists
                const clientExists = await this.clientDomainService.tryGetById(id);
                if (clientExists.isErr()) {
                    errors.push(new ClientDoesNotExistError({ message: clientExists.error.message }));
                    continue;
                }

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
                        errors.push(new CannotDeleteClientError({ message: `Cannot Client of id "${client.id.value}" while they have existing Real Estate Listings (Amount: ${listings.length})` }));
                        continue;
                    }
                }

                await this.unitOfWork.clientRepo.deleteAsync(client);
            } catch (e) {
                console.log(e)
                errors.push(new CannotDeleteClientError({ message: `Unable to delete Client of Id "${id}"` }));
            }
        }

        if (errors.length > 0) {
            await this.unitOfWork.rollbackTransaction();
            return err(errors);
        }

        await this.unitOfWork.commitTransaction();

        return ok(undefined);
    }
}
