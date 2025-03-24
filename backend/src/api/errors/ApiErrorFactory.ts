import API_ERROR_CODES from "./API_ERROR_CODES";
import IApiError from "./IApiError";
import { ErrorObject } from "ajv";
import ApplicationError from "application/errors/ApplicationError";

class ApiErrorFactory {
    static mapApplicationErrors(errors: ApplicationError[], codeMappings: Partial<Record<string, string[]>> = {}, defaultPath: string[] = ["_"]) {
        const mappedErrors: IApiError[] = errors.map((error) => {
            let finalPath = [...error.path];
            const pathPrefix = codeMappings[error.code];

            if (pathPrefix != null) {
                finalPath = [...pathPrefix, ...finalPath];
            } else {
                finalPath = defaultPath;
            }

            return {
                code: API_ERROR_CODES.APPLICATION_ERROR,
                message: error.message,
                path: `/${finalPath.join("/")}`,
            };
        });

        return mappedErrors;
    }

    static createSingleErrorList(props: { message: string; path: string; code: string }): [IApiError] {
        return [{ message: props.message, path: props.path, code: props.code }];
    }

    static mapAjvErrors(errors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined): IApiError[] {
        if (errors == null) {
            throw new Error("No errors were provided to mapAjvErrors.");
        }

        return errors.map<IApiError>((error) => ({ code: API_ERROR_CODES.VALIDATION_ERROR, message: error.message ?? "", path: error.instancePath }));
    }
}

export default ApiErrorFactory;
