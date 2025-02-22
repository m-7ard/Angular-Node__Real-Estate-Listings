import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUserRepository from "../../interfaces/IUserRepository";
import UserFactory from "domain/domainFactories/UserFactory";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import UserExistsValidator from "application/services/UserExistsValidator";
import IApplicationError from "application/errors/IApplicationError";

export type RegisterUserCommandResult = ICommandResult<IApplicationError[]>;

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
    private readonly _userRepository: IUserRepository;
    private readonly _passwordHasher: IPasswordHasher;
    private readonly userExistsValidator: UserExistsValidator;

    constructor(props: { userRepository: IUserRepository; passwordHasher: IPasswordHasher; userExistsValidator: UserExistsValidator; }) {
        this._userRepository = props.userRepository;
        this._passwordHasher = props.passwordHasher;
        this.userExistsValidator = props.userExistsValidator;
    }

    async handle(command: RegisterUserCommand): Promise<RegisterUserCommandResult> {
        const userExistResult = await this.userExistsValidator.validate({ email: command.email });
        if (userExistResult.isOk()) {
            return err(ApplicationErrorFactory.createSingleListError({
                message: `User of email "${command.email} already exists."`,
                code: APPLICATION_ERROR_CODES.ModelAlreadyExists,
                path: []
            }));
        }

        const hashed_password = await this._passwordHasher.hashPassword(command.password);
        const user = UserFactory.CreateNew({
            id: command.id,
            name: command.name,
            email: command.email,
            hashedPassword: hashed_password,
            isAdmin: false,
        });

        await this._userRepository.createAsync(user);
        return ok(undefined);
    }
}
