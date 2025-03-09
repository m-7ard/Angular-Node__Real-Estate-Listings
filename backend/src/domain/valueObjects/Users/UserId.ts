import IValueObject from "../IValueObject";
import { ok, Result } from "neverthrow";

export default class UserId implements IValueObject {
    __type = "UserId";

    private constructor(public value: string) {}

    public static canCreate(value: string): Result<boolean, string> {
        return ok(true);
    }

    public static executeCreate(value: string) {
        const canCreate = this.canCreate(value);
        if (canCreate.isErr()) throw new Error(canCreate.error);
        return new UserId(value);
    }

    equals(other: unknown): boolean {
        if (!(other instanceof UserId)) return false;
        return other.value === this.value;
    }

    toString() {
        return this.value;
    }
}
