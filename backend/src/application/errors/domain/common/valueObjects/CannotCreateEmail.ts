import ApplicationError from "application/errors/ApplicationError";

export default class CannotCreateEmail extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_EMAIL", path);
    }
}
