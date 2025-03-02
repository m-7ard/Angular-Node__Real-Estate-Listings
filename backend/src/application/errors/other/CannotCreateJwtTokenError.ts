import ApplicationError from "application/errors/ApplicationError";

class CannotCreateJwtTokenError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_JWT_TOKEN", path);
    }
}

export default CannotCreateJwtTokenError;
