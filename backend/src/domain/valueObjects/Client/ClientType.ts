import { err, ok } from "neverthrow";
import IValueObject from "../IValueObject";
import TDomainResult from "domain/errors/TDomainResult";

export default class ClientType implements IValueObject {
    readonly __type: "ClientType" = null!;

    public static readonly PRIVATE = new ClientType("PRIVATE");
    public static readonly CORPORATE = new ClientType("CORPORATE");

    private static readonly validTypes = [ClientType.PRIVATE, ClientType.CORPORATE];

    private constructor(public value: string) {}

    public static canCreate(value: string): TDomainResult {
        const type = this.validTypes.find(type => type.value === value);
        if (type == null) return err(`"${value}" is not a valid Real Estate Listing Type`);
        return ok(true);
    }

    public static executeCreate(value: string): ClientType {
        const canCreate = this.canCreate(value);
        if (canCreate.isErr()) throw new Error(canCreate.error.message);

        const type = this.validTypes.find(type => type.value === value);
        if (type == null) throw new Error(`"${value}" is not a valid Real Estate Listing Type`);
        return type;
    }

    public equals(other: unknown): boolean {
        if (!(other instanceof ClientType)) return false;
        return other.value === this.value;
    }
}
