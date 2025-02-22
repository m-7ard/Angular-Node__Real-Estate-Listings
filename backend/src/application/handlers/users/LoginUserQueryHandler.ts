import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IJwtTokenService from "application/interfaces/IJwtTokenService";
import IQuery, { IQueryResult } from "../IQuery";
import { IRequestHandler } from "../IRequestHandler";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import { err, ok } from "neverthrow";
import { JWT_ROLES } from "application/other/jwt-payload";
import UserExistsValidator from "application/services/UserExistsValidator";
import IApplicationError from "application/errors/IApplicationError";

export type LoginUserQueryResult = IQueryResult<{ jwtToken: string }, IApplicationError[]>;

export class LoginUserQuery implements IQuery<LoginUserQueryResult> {
    __returnType: LoginUserQueryResult = null!;

    constructor(props: { password: string; email: string }) {
        this.password = props.password;
        this.email = props.email;
    }

    public password: string;
    public email: string;
}

export default class LoginUserQueryHandler implements IRequestHandler<LoginUserQuery, LoginUserQueryResult> {
    private readonly _jwtTokenService: IJwtTokenService;
    private readonly _passwordHasher: IPasswordHasher;
    private readonly userExistsValidator: UserExistsValidator;

    constructor(props: { jwtTokenService: IJwtTokenService; passwordHasher: IPasswordHasher; userExistsValidator: UserExistsValidator; }) {
        this._jwtTokenService = props.jwtTokenService;
        this._passwordHasher = props.passwordHasher;
        this.userExistsValidator = props.userExistsValidator;
    }

    async handle(query: LoginUserQuery): Promise<LoginUserQueryResult> {
        const userExistResult = await this.userExistsValidator.validate({ email: query.email });
        if (userExistResult.isErr()) {
            return err(userExistResult.error);
        }

        const user = userExistResult.value;

        const isValid = await this._passwordHasher.verifyPassword(query.password, user.hashedPassword);
        if (!isValid) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Email or password is incorrect.`,
                    path: [],
                    code: APPLICATION_ERROR_CODES.StateMismatch,
                }),
            );
        }

        const jwtTokenResult = await this._jwtTokenService.generateToken({
            email: user.email,
            role: user.isAdmin ? JWT_ROLES.ADMIN : JWT_ROLES.CLIENT,
        });

        if (jwtTokenResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: jwtTokenResult.error,
                    path: [],
                    code: APPLICATION_ERROR_CODES.OperationFailed,
                }),
            );
        }

        return ok({ jwtToken: jwtTokenResult.value });
    }
}
