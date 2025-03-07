import IValueObject from "domain/valueObjects/IValueObject";
import { err, ok, Result } from "neverthrow";

class DatabaseProviderSingletonValue implements IValueObject {
    readonly __type: string = "DatabaseProviderSingletonValue";

    public static SQLite = new DatabaseProviderSingletonValue("SQLite");
    public static MySQL = new DatabaseProviderSingletonValue("MySQL");

    private static readonly validValues = [DatabaseProviderSingletonValue.SQLite, DatabaseProviderSingletonValue.MySQL];

    private constructor(public readonly value: string) {}

    public static canCreate(value: string): Result<boolean, string> {
        const validValue = this.validValues.find(v => v.value === value);

        if (validValue == null) return err(`${value} is not a valid DatabaseProviderSingletonValue.`);

        return ok(true);
    }

    public static executeCreate(value: string): DatabaseProviderSingletonValue {
        const canCreate = this.canCreate(value);

        if (canCreate.isErr()) throw new Error(canCreate.error);

        return new DatabaseProviderSingletonValue(value);
    }

    equals(other: unknown): boolean {
        if (!(other instanceof DatabaseProviderSingletonValue)) return false;
        return true;
    }

    toString() {
        return this.value;
    }
}

export default DatabaseProviderSingletonValue;
