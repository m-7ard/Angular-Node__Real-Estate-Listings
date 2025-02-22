import { err, ok, Result } from "neverthrow";
import { assert, Failure, Struct, StructError } from "superstruct";

export default function validateSuperstruct<T extends Struct<D>, D>(schema :T, data: D): Result<D, Array<Failure>> {
    try {
        assert(data, schema);
        return ok(data);
    } catch (error: unknown) {
        if (error instanceof StructError) {
            const structError = error as StructError;
            return err(structError.failures());
        }

        throw error;
    }
}