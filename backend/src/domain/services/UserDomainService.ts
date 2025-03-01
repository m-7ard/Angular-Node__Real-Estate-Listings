import IUserDomainService, { CreateAdminUserContract } from "application/interfaces/domainServices/IUserDomainService";
import IUnitOfWork from "application/interfaces/IUnitOfWork";
import User from "domain/entities/User";
import DomainError from "domain/errors/DomainError";
import CannotCreateUserError from "domain/errors/users/CannotCreateUserError";
import { err, ok, Result } from "neverthrow";

class UserDomainService implements IUserDomainService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    canCreateAdmin(contract: CreateAdminUserContract): Result<boolean, DomainError> {
        const canCreate = User.canCreate({ dateCreated: new Date(), email: contract.email, hashedPassword: contract.hashedPassword, id: contract.id, isAdmin: true, name: contract.name });
        if (canCreate.isErr()) return err(new CannotCreateUserError({ message: canCreate.error }));

        return ok(true);
    }

    async executeCreateAdmin(contract: CreateAdminUserContract): Promise<User> {
        const user = User.executeCreate({ dateCreated: new Date(), email: contract.email, hashedPassword: contract.hashedPassword, id: contract.id, isAdmin: true, name: contract.name });
        await this.unitOfWork.userRepo.createAsync(user);
        return user;
    }
}

export default UserDomainService;
