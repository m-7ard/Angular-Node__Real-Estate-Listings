import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";
import IValueObject from "../IValueObject";

export default class RealEstateListingId implements IValueObject {
    __type = "RealEstateListingId";

    private constructor(public value: string) {}

    public static canCreate(value: string): DomainValidationResult {
        return DomainValidationResult.AsOk();
    }

    public static executeCreate(value: string) {
        const canCreate = this.canCreate(value);
        if (canCreate.isError()) throw new Error(canCreate.error.message);
        return new RealEstateListingId(value);
    }

    equals(other: unknown): boolean {
        if (!(other instanceof RealEstateListingId)) return false;
        return other.value === this.value;
    }
}
