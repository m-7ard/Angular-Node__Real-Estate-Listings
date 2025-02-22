import IRegisterUserRequestDTO from "api/DTOs/users/register/IRegisterUserRequestDTO";
import { object, size, string } from "superstruct";
import email from "../custom-value-validators/email";
import validateSuperstruct from "api/utils/validateSuperstruct";

const validatorSchema = object({
    email: email,
    name: size(string(), 1, 64),
    password: size(string(), 8, 64),
});

function registerUserValidator(data: IRegisterUserRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default registerUserValidator;
