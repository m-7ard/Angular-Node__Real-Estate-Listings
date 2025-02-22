import { IJwtPayload } from "application/other/jwt-payload";
import { Result } from "neverthrow";

export default interface IJwtTokenService {
    generateToken(payload: IJwtPayload, options?: { expiresIn?: string | number }): Promise<Result<string, string>>;
    verifyToken<T>(token: string): Promise<Result<T, string>>;
    decodeToken<T>(token: string): T | null;
}
