import ApplicationError from "application/errors/ApplicationError";

export default class CannotCreateRealEstateListingIdError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_REAL_ESTATE_LISTING_ID", path);
    }
}
