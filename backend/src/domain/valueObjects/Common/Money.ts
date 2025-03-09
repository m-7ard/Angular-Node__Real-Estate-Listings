import MONEY_ERROR_CODES from "domain/errors/enums/MONEY_ERROR_CODES";
import IValueObject from "../IValueObject";
import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";

export default class Money implements IValueObject {
    __type = "Money";

    private constructor(public value: number) {}

    public static canCreate(value: number): DomainValidationResult {
        if (value < 0) return DomainValidationResult.AsError({ code: MONEY_ERROR_CODES.AMOUNT_TOO_SMALL, message: `"${value}" is not a valid value for Money.`});
        return DomainValidationResult.AsOk();
    }

    public static executeCreate(value: number): Money {
        const canCreate = this.canCreate(value);
        if (canCreate.isError()) throw new Error(canCreate.error.message);
        return new Money(value);
    }

    public equals(other: unknown): boolean {
        if (!(other instanceof Money)) return false;
        return other.value === this.value;
    }

    toString() {
        return this.value;
    }
}