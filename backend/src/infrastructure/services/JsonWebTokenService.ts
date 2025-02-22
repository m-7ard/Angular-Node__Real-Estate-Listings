import IJwtTokenService from "application/interfaces/IJwtTokenService";
import jwt from "jsonwebtoken";
import { err, ok, Result } from "neverthrow";

export class JsonWebTokenService implements IJwtTokenService {
    private readonly secretKey: string;

    constructor(secretKey: string) {
        if (!secretKey) {
            throw new Error("Secret key must be provided");
        }
        this.secretKey = secretKey;
    }

    async generateToken(payload: object, options?: { expiresIn?: string | number }): Promise<Result<string, string>> {
        try {
            return ok(jwt.sign(payload, this.secretKey, { expiresIn: options?.expiresIn || "1h" }));
        } catch (error) {
            return err(`Token generation failed: ${(error as Error).message}`);
        }
    }

    async verifyToken<T>(token: string): Promise<Result<T, string>> {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            return ok(decoded as T);
        } catch (error) {
            return err(`Token verification failed: ${(error as Error).message}`);
        }
    }

    decodeToken<T>(token: string): T | null {
        try {
            const decoded = jwt.decode(token);
            return decoded as T | null;
        } catch (err) {
            console.error(`Token decoding failed: ${(err as Error).message}`);
            return null;
        }
    }
}
