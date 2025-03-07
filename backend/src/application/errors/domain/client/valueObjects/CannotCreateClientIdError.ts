import ApplicationError from "application/errors/ApplicationError";

export default class CannotCreateClientIdError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_CLIENT_ID", path);
    }
}
