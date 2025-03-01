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

    private constructor(props: { id: UserId; name: string; email: string; hashedPassword: string; dateCreated: Date; isAdmin: boolean }) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.hashedPassword = props.hashedPassword;
        this.dateCreated = props.dateCreated;
        this.isAdmin = props.isAdmin;
    }

    public id: UserId;
    public name: string;
    public email: string;
    public hashedPassword: string;
    public dateCreated: Date;
    public isAdmin: boolean;

    public static canCreate(contract: CreateUserContract): Result<boolean, string> {
        const canCreateId = UserId.canCreate(contract.id);
        if (canCreateId.isErr()) return err(canCreateId.error);

        return ok(true);
    }

    public static executeCreate(contract: CreateUserContract): User {
        const canCreate = this.canCreate(contract);
        if (canCreate.isErr()) throw new Error(canCreate.error);

        const id = UserId.executeCreate(contract.id);

        return new User({ id: id, name: contract.name, email: contract.email, hashedPassword: contract.hashedPassword, dateCreated: contract.dateCreated, isAdmin: contract.isAdmin });
    }
}

export default User;
