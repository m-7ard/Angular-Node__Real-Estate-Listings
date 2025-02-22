import { StructError } from "superstruct";
import IPresentationError from "../errors/IPresentationError";
import JSONPointer from "jsonpointer";

export default function structErrorToPresentationError(errors: StructError): IPresentationError<object> {
    const result: IPresentationError<object> = {};

    errors.failures().forEach((error) => {
        const pointer = "/" + error.path.join("/");
        const existingValue = JSONPointer.get(result, pointer);
        
        if (existingValue == null) {
            JSONPointer.set(result, pointer, [error.message]);
        } else if (Array.isArray(existingValue)) {
            existingValue.push(error.message);
        }
    });

    return result;
}