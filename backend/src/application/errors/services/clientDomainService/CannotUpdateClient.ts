import ApplicationError from "application/errors/ApplicationError"

class CannotUpdateClient extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_UPDATE_CLIENT", path);
    }
}

export default CannotUpdateClient;
