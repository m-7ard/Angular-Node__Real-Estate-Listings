import ApplicationError from "application/errors/ApplicationError";

class PasswordsDoNotMatchError extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "PASSWORDS_DO_NOT_MATCH", path);
    }
}

export default PasswordsDoNotMatchError;
