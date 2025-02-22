import { err, ok, Result } from "neverthrow"

type TDomainResult = Result<boolean, IDomainError>;

export class DomainResult {
    constructor(private result: TDomainResult) {}

    public static fromError(error: IDomainError) {
        return new DomainResult(err(error));
    } 
    
    public static get OK() {
        return new DomainResult(ok(true));
    };

    public get isError() {
        return this.result.isErr();
    }

    public get error(): IDomainError {
        if (!this.result.isErr()) {
            throw new Error("Domain Result is not of error type.")
        } 
        
        return this.result.error;
    }
}

export default TDomainResult;