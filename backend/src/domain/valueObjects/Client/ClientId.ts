import IValueObject from "../IValueObject";
import { ok, Result } from "neverthrow";

export default class ClientId implements IValueObject {
    __type = "ClientId";

    private constructor(public value: string) {}

    public static canCreate(value: string): Result<boolean, string> {
        return ok(true);
    }

    public static executeCreate(value: string) {
        const canCreate = this.canCreate(value);
        if (canCreate.isErr()) throw new Error(canCreate.error);
        return new ClientId(value);
    }

    equals(other: unknown): boolean {
        if (!(other instanceof ClientId)) return false;
        return other.value === this.value;
    }

    toString() {
        return this.value;
    }
}
