import ApplicationError from "application/errors/ApplicationError";

class CannotCreateNewClient extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_NEW_CLIENT", path);
    }
}

export default CannotCreateNewClient;
