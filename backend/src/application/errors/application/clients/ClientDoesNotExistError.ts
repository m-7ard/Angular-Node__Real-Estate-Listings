import ApplicationError from "application/errors/ApplicationError";

class ClientDoesNotExistError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CLIENT_DOES_NOT_EXIST", path);
    }
}

export default ClientDoesNotExistError;
