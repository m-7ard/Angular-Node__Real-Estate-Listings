import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ExpressHttpService from "api/services/ExpressHttpService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";

export default async function userIsAuthenticatedGuard(req: Request, res: Response, next: Next) {
    const jwtService = diContainer.resolve(DI_TOKENS.JWT_TOKEN_SERVICE);
    const httpService = new ExpressHttpService(req, res);
    const token = httpService.readJwtToken();
    if (token == null) {
        res.status(StatusCodes.UNAUTHORIZED).json(
            ApiErrorFactory.createSingleErrorList({
                code: API_ERROR_CODES.GUARD_ERROR,
                message: "Jwt is missing from authorization header.",
                path: "_",
            }),
        );
        return;
    }

    const validation = await jwtService.verifyToken(token);
    if (validation.isErr()) {
        res.status(StatusCodes.UNAUTHORIZED).json(
            ApiErrorFactory.createSingleErrorList({
                code: API_ERROR_CODES.GUARD_ERROR,
                message: "Invalid Jwt in authorization header.",
                path: "_",
            }),
        );
        return;
    }

    next();
}
