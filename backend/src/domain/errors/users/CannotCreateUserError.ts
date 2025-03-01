import DomainError from "../DomainError";

export default class CannotCreateUserError extends DomainError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_USER", path);
    }
}
