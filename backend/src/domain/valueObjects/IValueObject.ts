export default interface IValueObject {
    __type: string;
    equals(other: unknown): boolean;
}
