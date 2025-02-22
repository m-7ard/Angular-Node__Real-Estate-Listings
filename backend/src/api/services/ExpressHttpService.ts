import IHttpService from "api/interfaces/IHttpRequestService";
import { JWT_TOKEN_COOKIE_KEY } from "api/utils/constants";
import { Request, Response } from "express";

class ExpressHttpService implements IHttpService {
    constructor(
        private readonly request: Request,
        private readonly response: Response,
    ) {}

    readJwtToken(): string | null {
        const headers = this.request.rawHeaders;
        const row = headers.find((row) => row.startsWith("Bearer"));
        if (row == null) {
            return null;
        }

        return row.split(" ")[1];
    }

    /**
      * @deprecated
    */
    writeJwtToken(token: string): void {
        // Development settings only
        this.response.cookie(JWT_TOKEN_COOKIE_KEY, token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
        });
    }
}

export default ExpressHttpService;
