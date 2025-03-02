import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import User from "domain/entities/User";
import IJwtTokenService from "application/interfaces/IJwtTokenService";
import { IJwtPayload } from "application/other/jwt-payload";
import ApplicationError from "application/errors/ApplicationError";
import InvalidJwtTokenError from "application/errors/other/InvalidJwtTokenError";
import IUserDomainService from "application/interfaces/domainServices/IUserDomainService";

export type CurrentUserQueryResult = IQueryResult<User | null, ApplicationError[]>;

export class CurrentUserQuery implements IQuery<CurrentUserQueryResult> {
    __returnType: CurrentUserQueryResult = null!;

    constructor(props: { token: string }) {
        this.token = props.token;
    }

    public token: string;
}

export default class CurrentUserQueryHandler implements IRequestHandler<CurrentUserQuery, CurrentUserQueryResult> {

    constructor(private readonly userDomainService: IUserDomainService, private readonly jwtTokenService: IJwtTokenService) {}

    async handle(query: CurrentUserQuery): Promise<CurrentUserQueryResult> {
        const verificationResult = await this.jwtTokenService.verifyToken<IJwtPayload>(query.token);
        if (verificationResult.isErr()) return err(new InvalidJwtTokenError({ message: verificationResult.error }).asList());

        const payload = verificationResult.value;
        const tryGetUser = await this.userDomainService.tryGetUserByEmail(payload.email);
        if (tryGetUser.isErr()) return ok(null);
        return ok(tryGetUser.value);
    }
}
