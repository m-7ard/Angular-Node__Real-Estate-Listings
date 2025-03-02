import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";
import IValueObject from "../IValueObject";
import EMAIL_ERROR_CODES from "domain/errors/enums/EMAIL_ERROR_CODES";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default class Email implements IValueObject {
    __type = "Email";

    private constructor(public value: string) {}

    public static canCreate(value: string): DomainValidationResult {
        const isValid = emailRegex.test(value);
        if (!isValid) return DomainValidationResult.AsError({ code: EMAIL_ERROR_CODES.INVALID_FORMAT, message: `Value of "${value}" is not a valid email.` });

        return DomainValidationResult.AsOk();
    }

    public static executeCreate(value: string) {
        const canCreate = this.canCreate(value);
        if (canCreate.isError()) throw new Error(canCreate.error.message);
        return new Email(value);
    }

    equals(other: unknown): boolean {
        if (!(other instanceof Email)) return false;
        return other.value === this.value;
    }
}
