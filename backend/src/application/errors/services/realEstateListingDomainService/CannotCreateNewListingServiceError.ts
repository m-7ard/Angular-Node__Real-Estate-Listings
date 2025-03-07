import ApplicationError from "../../ApplicationError";

export default class CannotCreateNewListingServiceError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_NEW_LISTING_SERVICE_ERROR", path);
    }
}
