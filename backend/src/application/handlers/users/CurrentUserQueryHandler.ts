import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import IUserRepository from "../../interfaces/IUserRepository";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import User from "domain/entities/User";
import IJwtTokenService from "application/interfaces/IJwtTokenService";
import { IJwtPayload } from "application/other/jwt-payload";
import IApplicationError from "application/errors/IApplicationError";

export type CurrentUserQueryResult = IQueryResult<User | null, IApplicationError[]>;

export class CurrentUserQuery implements IQuery<CurrentUserQueryResult> {
    __returnType: CurrentUserQueryResult = null!;

    constructor(props: { token: string }) {
        this.token = props.token;
    }

    public token: string;
}

export default class CurrentUserQueryHandler implements IRequestHandler<CurrentUserQuery, CurrentUserQueryResult> {
    private readonly _userRepository: IUserRepository;
    private readonly _jwtTokenService: IJwtTokenService;

    constructor(props: { userRepository: IUserRepository; jwtTokenService: IJwtTokenService }) {
        this._userRepository = props.userRepository;
        this._jwtTokenService = props.jwtTokenService;
    }

    async handle(query: CurrentUserQuery): Promise<CurrentUserQueryResult> {
        const verificationResult = await this._jwtTokenService.verifyToken<IJwtPayload>(query.token);
        if (verificationResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Invalid Jwt Token was provided.".`,
                    path: [],
                    code: APPLICATION_ERROR_CODES.OperationFailed,
                }),
            );
        }

        const payload = verificationResult.value;
        const existingUser = await this._userRepository.getByEmailAsync(payload.email);
        return ok(existingUser);
    }
}
