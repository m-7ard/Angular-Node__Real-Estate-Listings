import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/IUnitOfWork";
import IUserDomainService from "application/interfaces/domainServices/IUserDomainService";
import ApplicationError from "application/errors/ApplicationError";
import CannotCreateClientUserServiceError from "application/errors/services/userDomainService/CannotCreateClientUserServiceError";

export type RegisterUserCommandResult = ICommandResult<ApplicationError[]>;

export class RegisterUserCommand implements ICommand<RegisterUserCommandResult> {
    __returnType: RegisterUserCommandResult = null!;

    constructor({ id, name, password, email }: { id: string; name: string; password: string; email: string }) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
    }

    public id: string;
    public name: string;
    public password: string;
    public email: string;
}

export default class RegisterUserCommandHandler implements IRequestHandler<RegisterUserCommand, RegisterUserCommandResult> {
    constructor(private readonly unitOfWork: IUnitOfWork, private readonly userDomainService: IUserDomainService) {}

    async handle(command: RegisterUserCommand): Promise<RegisterUserCommandResult> {
        this.unitOfWork.beginTransaction();

        const tryCreate = await this.userDomainService.tryCreateStandardUser({
            id: command.id,
            email: command.email,
            name: command.name,
            password: command.password
        })

        if (tryCreate.isErr()) return err(new CannotCreateClientUserServiceError({ message: tryCreate.error.message }).asList());

        await this.unitOfWork.commitTransaction();
        
        return ok(undefined);
    }
}
