import ApplicationError from "application/errors/ApplicationError";

class UserDoesNotExist extends ApplicationError {
    constructor({ message, path = [] }: { message: string, path?: string[]}) {
        super(message, "USER_DOES_NOT_EXIST", path);
    }
}

export default UserDoesNotExist;
