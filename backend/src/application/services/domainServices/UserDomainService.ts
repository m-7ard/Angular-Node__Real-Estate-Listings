import IUserDomainService, { CreateAdminUserContract, CreateStandardUserContract } from "application/interfaces/domainServices/IUserDomainService";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import User from "domain/entities/User";
import CannotCreateEmail from "application/errors/domain/common/valueObjects/CannotCreateEmail";
import ApplicationError from "application/errors/ApplicationError";
import CannotCreateUserError from "application/errors/domain/users/CannotCreateUserError";
import Email from "domain/valueObjects/Common/Email";
import { err, ok, Result } from "neverthrow";
import UserDoesNotExist from "application/errors/application/users/UserDoesNotExist";
import IPasswordHasher from "application/interfaces/IPasswordHasher";

class UserDomainService implements IUserDomainService {
    constructor(private readonly unitOfWork: IUnitOfWork, private readonly passwordHasher: IPasswordHasher) {}

    async tryCreateAdminUser(contract: CreateAdminUserContract): Promise<Result<User, ApplicationError>> {
        const userExistResult = await this.tryGetUserByEmail(contract.email);
        if (userExistResult.isOk()) return err(new UserDoesNotExist({ message: `User of email "${contract.email} already exists.` }));

        const hashedPassword = await this.passwordHasher.hashPassword(contract.password);
        const createContract = { dateCreated: new Date(), email: contract.email, hashedPassword: hashedPassword, id: contract.id, isAdmin: true, name: contract.name };
        
        const canCreate = User.canCreate(createContract);
        if (canCreate.isError()) return err(new CannotCreateUserError({ message: canCreate.error.message }));

        const user = User.executeCreate(createContract);
        await this.unitOfWork.userRepo.createAsync(user);

        return ok(user);
    }

    async tryCreateStandardUser(contract: CreateStandardUserContract): Promise<Result<User, ApplicationError>> {
        const userExistResult = await this.tryGetUserByEmail(contract.email);
        if (userExistResult.isOk()) return err(new UserDoesNotExist({ message: `User of email "${contract.email} already exists.` }));

        const hashedPassword = await this.passwordHasher.hashPassword(contract.password);
        const createContract = { dateCreated: new Date(), email: contract.email, hashedPassword: hashedPassword, id: contract.id, isAdmin: false, name: contract.name };
        
        const canCreate = User.canCreate(createContract);
        if (canCreate.isError()) return err(new CannotCreateUserError({ message: canCreate.error.message }));

        const user = User.executeCreate(createContract);
        await this.unitOfWork.userRepo.createAsync(user);

        return ok(user);
    }

    async tryGetUserByEmail(email: string): Promise<Result<User, ApplicationError>> {
        const canCreateEmail = Email.canCreate(email);
        if (canCreateEmail.isError()) return err(new CannotCreateEmail({ message: canCreateEmail.error.message }));

        const emailObj = Email.executeCreate(email);

        const user = await this.unitOfWork.userRepo.getByEmailAsync(emailObj);
        if (user == null) {
            return err(new CannotCreateEmail({ message: `User with email "${email}" does not exist` }));
        }

        return ok(user);
    }
}

export default UserDomainService;
