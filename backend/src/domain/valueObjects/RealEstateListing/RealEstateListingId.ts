import IValueObject from "../IValueObject";
import { DomainResult } from "domain/errors/TDomainResult";

export default class RealEstateListingId implements IValueObject {
    __type = "RealEstateListingId";

    private constructor(public value: string) {}

    public static canCreate(value: string): DomainResult {
        return DomainResult.OK;
    }

    public static executeCreate(value: string) {
        const canCreate = this.canCreate(value);
        if (canCreate.isError) throw new Error(canCreate.error.message);
        return new RealEstateListingId(value);
    }

    equals(other: unknown): boolean {
        if (!(other instanceof RealEstateListingId)) return false;
        return other.value === this.value;
    }
}
