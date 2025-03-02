import ApplicationError from "application/errors/ApplicationError";

class CannotCreateClientUserServiceError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_CLIENT_USER_SERVICE_ERROR", path);
    }
}

export default CannotCreateClientUserServiceError;
