import DomainError from "../DomainError";

export default class CannotCreateClientError extends DomainError {
    constructor({ message, path = [] }: { message: string, path: string[]}) {
        super(message, "CANNOT_CREATE_CLIENT", path);
    }
}
