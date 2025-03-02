import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";
import USER_ERROR_CODES from "domain/errors/enums/USER_ERROR_CODES";
import Email from "domain/valueObjects/Common/Email";
import UserId from "domain/valueObjects/Users/UserId";
import { err, ok, Result } from "neverthrow";

interface CreateUserContract {
    id: string;
    name: string;
    email: string;
    hashedPassword: string;
    dateCreated: Date;
    isAdmin: boolean;
}

class User {
    private readonly __type: "USER_DOMAIN" = null!;

    private constructor(props: { id: UserId; name: string; email: Email; hashedPassword: string; dateCreated: Date; isAdmin: boolean }) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.hashedPassword = props.hashedPassword;
        this.dateCreated = props.dateCreated;
        this.isAdmin = props.isAdmin;
    }

    public id: UserId;
    public name: string;
    public email: Email;
    public hashedPassword: string;
    public dateCreated: Date;
    public isAdmin: boolean;

    public static canCreate(contract: CreateUserContract): DomainValidationResult {
        const canCreateId = UserId.canCreate(contract.id);
        if (canCreateId.isErr()) return DomainValidationResult.AsError({ code: USER_ERROR_CODES.INVALID_ID,  message: canCreateId.error });

        const canCreateEmail = Email.canCreate(contract.email);
        if (canCreateEmail.isError()) return DomainValidationResult.AsError({ message: canCreateEmail.error.message, code: USER_ERROR_CODES.INVALID_EMAIL });

        return DomainValidationResult.AsOk();
    }

    public static executeCreate(contract: CreateUserContract): User {
        const canCreate = this.canCreate(contract);
        if (canCreate.isError()) throw new Error(canCreate.error.message);

        const id = UserId.executeCreate(contract.id);
        const email = Email.executeCreate(contract.email);

        return new User({ id: id, name: contract.name, email: email, hashedPassword: contract.hashedPassword, dateCreated: contract.dateCreated, isAdmin: contract.isAdmin });
    }
}

export default User;
