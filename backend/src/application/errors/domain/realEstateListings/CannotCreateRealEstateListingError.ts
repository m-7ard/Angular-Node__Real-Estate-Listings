import ApplicationError from "../../ApplicationError";

export default class CannotCreateRealEstateListingError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path: string[]}) {
        super(message, "CANNOT_CREATE_REAL_ESTATE_LISTING", path);
    }
}
