import { err, ok, Result } from "neverthrow";

class DomainError {
    public readonly code: string;
    public readonly message: string;

    constructor(params: { code: string; message: string }) {
        this.code = params.code;
        this.message = params.message;
    }
}

export default class DomainValidationResult {
    constructor(private readonly result: Result<boolean, DomainError>) {}

    isValid() {
        return this.result.isOk();
    }

    isError() {
        return this.result.isErr();
    } 

    get error() {
        if (this.result.isErr()) {
            return this.result.error;
        }

        throw new Error("DomainValidationResult is not error.");
    }

    public static AsOk() {
        return new DomainValidationResult(ok(true));
    }

    public static AsError({ code, message }: {code: string, message: string}) {
        return new DomainValidationResult(err(new DomainError({ code, message })));
    }
}
