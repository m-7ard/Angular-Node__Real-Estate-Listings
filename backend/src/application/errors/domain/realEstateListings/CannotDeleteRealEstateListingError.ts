import ApplicationError from "../../ApplicationError";

export default class CannotDeleteRealEstateListingError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_DELETE_REAL_ESTATE_LISTING", path);
    }
}
