import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import ApplicationError from "application/errors/ApplicationError";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import RealEstateListingDoesNotExistError from "application/errors/application/realEstateListings/RealEstateListingDoesNotExistError";
import CannotDeleteRealEstateListingError from "application/errors/domain/realEstateListings/CannotDeleteRealEstateListingError";

export type DeleteManyRealEstateListingsCommandResult = ICommandResult<ApplicationError[]>;

export class DeleteManyRealEstateListingsCommand implements ICommand<DeleteManyRealEstateListingsCommandResult> {
    __returnType: DeleteManyRealEstateListingsCommandResult = null!;

    constructor(params: { ids: string[] }) {
        this.ids = params.ids;
    }

    ids: string[];
}

export default class DeleteManyRealEstateListingsCommandHandler implements IRequestHandler<DeleteManyRealEstateListingsCommand, DeleteManyRealEstateListingsCommandResult> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly realEstateListingDomainService: IRealEstateListingDomainService,
    ) {}

    async handle(command: DeleteManyRealEstateListingsCommand): Promise<DeleteManyRealEstateListingsCommandResult> {
        await this.unitOfWork.beginTransaction();
        const errors: ApplicationError[] = [];
        
        for (let i = 0; i < command.ids.length; i++) {
            const id = command.ids[i];

            try {
                // Listing Exists
                const listingExists = await this.realEstateListingDomainService.tryGetById(id);
                if (listingExists.isErr()) {
                    errors.push(new RealEstateListingDoesNotExistError({ message: listingExists.error.message }))
                    continue;
                };

                const listing = listingExists.value;

                // Delete
                await this.unitOfWork.realEstateListingRepo.deleteAsync(listing);
            } catch (e) {
                errors.push(new CannotDeleteRealEstateListingError({ message: `Unable to delete Real Estate Listing of Id "${id}"` }))
            }
        }

        if (errors.length > 0) return err(errors);

        await this.unitOfWork.commitTransaction();
        return ok(undefined);
    }
}
