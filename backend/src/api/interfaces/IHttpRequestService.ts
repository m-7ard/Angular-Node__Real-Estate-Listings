
export default interface IHttpService {
    readJwtToken(): string | null;
    writeJwtToken(token: string): void;
}
