import ApplicationError from "../../ApplicationError";

export default class CannotUpdateRealEstateListingError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_UPDATE_REAL_ESTATE_LISTING", path);
    }
}
