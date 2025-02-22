import { object, size, string } from "superstruct";
import email from "../custom-value-validators/email";
import validateSuperstruct from "api/utils/validateSuperstruct";
import ILoginUserRequestDTO from "api/DTOs/users/login/ILoginUserRequestDTO";

const validatorSchema = object({
    email: email,
    password: size(string(), 8, 64),
});

function loginUserValidator(data: ILoginUserRequestDTO) {
    return validateSuperstruct(validatorSchema, data);
}

export default loginUserValidator;
