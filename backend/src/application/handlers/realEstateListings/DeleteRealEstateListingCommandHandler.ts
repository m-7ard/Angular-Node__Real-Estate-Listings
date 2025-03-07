import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import ApplicationError from "application/errors/ApplicationError";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import RealEstateListingDoesNotExistError from "application/errors/application/realEstateListings/RealEstateListingDoesNotExistError";

export type DeleteRealEstateListingCommandResult = ICommandResult<ApplicationError[]>;

export class DeleteRealEstateListingCommand implements ICommand<DeleteRealEstateListingCommandResult> {
    __returnType: DeleteRealEstateListingCommandResult = null!;

    constructor(params: { 
        id: string;
    }) {
        this.id = params.id;
    }

    id: string;
}

export default class DeleteRealEstateListingCommandHandler implements IRequestHandler<DeleteRealEstateListingCommand, DeleteRealEstateListingCommandResult> {
    constructor(private readonly unitOfWork: IUnitOfWork, private readonly realEstateListingDomainService: IRealEstateListingDomainService) {}

    async handle(command: DeleteRealEstateListingCommand): Promise<DeleteRealEstateListingCommandResult> {
        try {
            // Listing Exists
            const listingExists = await this.realEstateListingDomainService.tryGetById(command.id);
            if (listingExists.isErr()) return err(new RealEstateListingDoesNotExistError({ message: listingExists.error.message }).asList());

            const listing = listingExists.value;

            // Delete
            await this.unitOfWork.realEstateListingRepo.deleteAsync(listing);
            
            await this.unitOfWork.commitTransaction();
            return ok(undefined);
        } finally {
            await this.unitOfWork.rollbackTransaction();
        }
    }
}
