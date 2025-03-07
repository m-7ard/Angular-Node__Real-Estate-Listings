import ApplicationError from "application/errors/ApplicationError";

class RealEstateListingDoesNotExistError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "REAL_ESTATE_LISTING_DOES_NOT_EXIST", path);
    }
}

export default RealEstateListingDoesNotExistError;
