import ApplicationError from "application/errors/ApplicationError";

class CannotDeleteClientError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CannotDeleteClientError", path);
    }
}

export default CannotDeleteClientError;
