import { err, ok, Result } from "neverthrow";
import IValueObject from "../IValueObject";
import TDomainResult from "domain/errors/TDomainResult";

export default class ClientId implements IValueObject {
    __type = "ClientId";

    private constructor(public value: string) {}

    public static canCreate(value: string): TDomainResult {
        return ok(true);
    }

    public static executeCreate(value: string) {
        const canCreate = this.canCreate(value);
        if (canCreate.isErr()) throw new Error(canCreate.error.message);
        return new ClientId(value);
    }

    equals(other: unknown): boolean {
        if (!(other instanceof ClientId)) return false;
        return other.value === this.value;
    }
}
