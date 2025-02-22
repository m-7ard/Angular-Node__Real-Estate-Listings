import { err, ok, Result } from "neverthrow";
import IValueObject from "../IValueObject";
import { DomainResult } from "domain/errors/TDomainResult";

interface CreateRealEstateListingAddressContract {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export default class RealEstateListingAddress implements IValueObject {
    readonly __type: "RealEstateListingAddress" = null!;

    private constructor(
        public street: string,
        public city: string,
        public state: string,
        public zip: string,
        public country: string,
    ) {}

    public static canCreate(value: CreateRealEstateListingAddressContract): DomainResult {
        return DomainResult.OK;
    }

    public static executeCreate(value: CreateRealEstateListingAddressContract): RealEstateListingAddress {
        const canCreate = this.canCreate(value);
        if (canCreate.isError) throw new Error(canCreate.error.message);
        return new RealEstateListingAddress(value.street, value.city, value.state, value.zip, value.country);
    }

    public equals(other: unknown): boolean {
        if (!(other instanceof RealEstateListingAddress)) return false;
        return (
            other.street === this.street &&
            other.city === this.city &&
            other.state === this.state &&
            other.zip === this.zip &&
            other.country === this.country
        );
    }
}
