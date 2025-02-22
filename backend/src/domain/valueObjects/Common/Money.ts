import IValueObject from "../IValueObject";
import { DomainResult } from "domain/errors/TDomainResult";

export default class Money implements IValueObject {
    __type = "Money";

    private constructor(public value: number) {}

    public static canCreate(value: number): DomainResult {
        if (value < 0) return DomainResult.fromError({ message: `"${value}" is not a valid value for Money.`, code: "CANNOT_CREATE_MONEY" });
        return DomainResult.OK;
    }

    public static executeCreate(value: number): Money {
        const canCreate = this.canCreate(value);
        if (canCreate.isError) throw new Error(canCreate.error.message);
        return new Money(value);
    }

    public equals(other: unknown): boolean {
        if (!(other instanceof Money)) return false;
        return other.value === this.value;
    }
}