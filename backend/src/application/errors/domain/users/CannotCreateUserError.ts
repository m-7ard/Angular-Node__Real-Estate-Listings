import ApplicationError from "../../ApplicationError";

export default class CannotCreateUserError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_USER", path);
    }
}
