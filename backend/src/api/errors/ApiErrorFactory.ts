import API_ERROR_CODES from "./API_ERROR_CODES";
import { Failure } from "superstruct";
import IApiError from "./IApiError";
import IApplicationError from "application/errors/IApplicationError";

class ApiErrorFactory {
    static superstructFailureToApiErrors(errors: Array<Failure>, pathPrefix: string[] = []) {
        const prefix = pathPrefix.length === 0 ? "" : `${pathPrefix.join("/")}`;
        return errors.map((error) => ({
            message: error.message,
            path: "/" + prefix + error.path,
            code: API_ERROR_CODES.VALIDATION_ERROR,
        }));
    }

    static applicationErrorToApiErrors(errors: IApplicationError[], pathPrefix: string[] = []) {
        const prefix = pathPrefix.length === 0 ? "" : `/${pathPrefix.join("/")}`;
        return errors.map((error) => ({
            message: error.message,
            path: prefix + `/${error.path.join("/")}`,
            code: API_ERROR_CODES.APPLICATION_ERROR,
        }));
    }

    static mapApplicationErrors(errors: IApplicationError[], codeMappings: Partial<Record<string, string[]>> = {}, defaultPath: string[] = ["_"]) {
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
}

export default ApiErrorFactory;
