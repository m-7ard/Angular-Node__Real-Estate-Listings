import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";
import IValueObject from "../IValueObject";
import REAL_ESTATE_LISTING_ERROR_CODES from "domain/errors/enums/REAL_ESTATE_LISTING_ERROR_CODES";

export default class RealEstateListingType implements IValueObject {
    readonly __type: "RealEstateListingType" = null!;

    public static readonly HOUSE = new RealEstateListingType("HOUSE");
    public static readonly APARTMENT = new RealEstateListingType("APARTMENT");

    private static readonly validTypes = [RealEstateListingType.HOUSE, RealEstateListingType.APARTMENT];

    private constructor(public value: string) {}

    public static canCreate(value: string): DomainValidationResult {
        const type = this.validTypes.find(type => type.value === value);
        if (type == null) return DomainValidationResult.AsError({ message: `"${value}" is not a valid Real Estate Listing Type`, code: REAL_ESTATE_LISTING_ERROR_CODES.CANNOT_CREATE_TYPE });
        return DomainValidationResult.AsOk();
    }

    public static executeCreate(value: string): RealEstateListingType {
        const canCreate = this.canCreate(value);
        if (canCreate.isError()) throw new Error(canCreate.error.message);

        const type = this.validTypes.find(type => type.value === value);
        if (type == null) throw new Error(`"${value}" is not a valid Real Estate Listing Type`);
        return type;
    }

    public equals(other: unknown): boolean {
        if (!(other instanceof RealEstateListingType)) return false;
        return other.value === this.value;
    }

    toString() {
        return this.value;
    }
}
