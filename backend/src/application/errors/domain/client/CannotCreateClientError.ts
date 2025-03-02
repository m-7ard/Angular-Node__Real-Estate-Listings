import ApplicationError from "../../ApplicationError";

export default class CannotCreateClientError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path: string[]}) {
        super(message, "CANNOT_CREATE_CLIENT", path);
    }
}
