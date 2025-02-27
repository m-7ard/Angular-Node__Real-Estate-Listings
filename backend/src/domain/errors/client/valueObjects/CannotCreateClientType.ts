import DomainError from "domain/errors/DomainError";

export default class CannotCreateClientType extends DomainError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "CANNOT_CREATE_CLIENT_TYPE", path);
    }
}
