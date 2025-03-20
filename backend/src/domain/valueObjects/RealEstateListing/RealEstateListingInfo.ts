import DomainValidationResult from "domain/errors/definitions/DomainValidationResult";
import IValueObject from "../IValueObject";

interface CreateRealEstateListingInfoContract {
    squareMeters: number;
    yearBuilt: number;
    bathroomNumber: number;
    bedroomNumber: number;
    description: string;
    flooringType: string;
}

export default class RealEstateListingInfo implements IValueObject {
    readonly __type: "RealEstateListingInfo" = null!;

    private constructor(
        public squareMeters: number,
        public yearBuilt: number,
        public bathroomNumber: number,
        public bedroomNumber: number,
        public description: string,
        public flooringType: string,
    ) {}

    public static canCreate(value: CreateRealEstateListingInfoContract): DomainValidationResult {
        return DomainValidationResult.AsOk();
    }

    public static executeCreate(value: CreateRealEstateListingInfoContract): RealEstateListingInfo {
        const canCreate = this.canCreate(value);
        if (canCreate.isError()) throw new Error(canCreate.error.message);
        return new RealEstateListingInfo(value.squareMeters, value.yearBuilt, value.bathroomNumber, value.bedroomNumber, value.description, value.flooringType);
    }

    public equals(other: unknown): boolean {
        if (!(other instanceof RealEstateListingInfo)) return false;
        return (
            other.squareMeters === this.squareMeters &&
            other.yearBuilt === this.yearBuilt &&
            other.bathroomNumber === this.bathroomNumber &&
            other.bedroomNumber === this.bedroomNumber &&
            other.description === this.description &&
            other.flooringType === this.flooringType
        );
    }
}
