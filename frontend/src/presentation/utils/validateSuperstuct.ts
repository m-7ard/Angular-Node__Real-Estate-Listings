import { assert, Failure, Struct, StructError } from 'superstruct';
import { err, ok, Result } from 'neverthrow';

function validateSuperstruct<T, S>(value: unknown, struct: Struct<T, S>): Result<T, StructError> {
    try {
        assert(value, struct);
        return ok(value);
    } catch (error: unknown) {
        if (error instanceof StructError) {
            const structError = error as StructError;
            return err(structError);
        }

        throw error;
    }
}

export default validateSuperstruct;
