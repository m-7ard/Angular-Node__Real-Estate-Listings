import ApplicationError from "../../ApplicationError";

export default class CannotUpdateListingServiceError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_UPDATE_LISTING_SERVICE_ERROR", path);
    }
}
