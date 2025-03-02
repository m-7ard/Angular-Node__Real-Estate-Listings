import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IJwtTokenService from "application/interfaces/IJwtTokenService";
import IQuery, { IQueryResult } from "../IQuery";
import { IRequestHandler } from "../IRequestHandler";
import { err, ok } from "neverthrow";
import { JWT_ROLES } from "application/other/jwt-payload";
import IUserDomainService from "application/interfaces/domainServices/IUserDomainService";
import ApplicationError from "application/errors/ApplicationError";
import UserDoesNotExist from "application/errors/services/userDomainService/UserDoesNotExist";
import PasswordsDoNotMatchError from "application/errors/other/PasswordsDoNotMatchError";
import CannotCreateJwtTokenError from "application/errors/other/CannotCreateJwtTokenError";

export type LoginUserQueryResult = IQueryResult<{ jwtToken: string }, ApplicationError[]>;

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
    constructor(private readonly jwtTokenService: IJwtTokenService, private readonly passwordHasher: IPasswordHasher, private readonly userDomainService: IUserDomainService) {}

    async handle(query: LoginUserQuery): Promise<LoginUserQueryResult> {
        const tryGetUser = await this.userDomainService.tryGetUserByEmail(query.email);
        if (tryGetUser.isErr()) return err(new UserDoesNotExist({ message: tryGetUser.error.message }).asList());

        const user = tryGetUser.value;

        const isValid = await this.passwordHasher.verifyPassword(query.password, user.hashedPassword);
        if (!isValid) return err(new PasswordsDoNotMatchError({ message: `Email or password is incorrect.` }).asList());

        const jwtTokenResult = await this.jwtTokenService.generateToken({
            email: user.email.value,
            role: user.isAdmin ? JWT_ROLES.ADMIN : JWT_ROLES.CLIENT,
        });

        if (jwtTokenResult.isErr()) return err(new CannotCreateJwtTokenError({ message: jwtTokenResult.error }).asList());
        return ok({ jwtToken: jwtTokenResult.value });
    }
}
