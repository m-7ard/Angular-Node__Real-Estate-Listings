import { Type } from "@sinclair/typebox";
import addFormats from "ajv-formats";
import Ajv from "ajv";

const ajv = addFormats(new Ajv({}), [
    "date-time",
    "time",
    "date",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "uri",
    "uri-reference",
    "uuid",
    "uri-template",
    "json-pointer",
    "relative-json-pointer",
    "regex",
]);

type DateOrFallback<T> = Date & { __type: T };

const parsers = {
    parseDateOrElse: <T>(rawValue: any, fallback: T): DateOrFallback<T> => {
        const validate = ajv.compile(Type.Union([Type.String({ format: "date-time" }), Type.String({ format: "date" })]));
        const isValid = validate(rawValue);
        return (isValid ? new Date(rawValue as any) : fallback) as DateOrFallback<T>;
    },
};

export default parsers;
