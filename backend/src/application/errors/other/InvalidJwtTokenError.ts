import ApplicationError from "application/errors/ApplicationError";

class InvalidJwtTokenError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "INVALID_JWT_TOKEN", path);
    }
}

export default InvalidJwtTokenError;
