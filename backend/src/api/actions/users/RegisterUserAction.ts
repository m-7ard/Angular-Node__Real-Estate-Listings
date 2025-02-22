import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IRegisterUserRequestDTO from "api/DTOs/users/register/IRegisterUserRequestDTO";
import IRegisterUserResponseDTO from "api/DTOs/users/register/IRegisterUserResponseDTO";
import registerUserValidator from "api/validators/users/registerUserValidator";
import { RegisterUserCommand } from "application/handlers/users/RegisterUserCommandHandler";

type ActionRequest = { dto: IRegisterUserRequestDTO };
type ActionResponse = JsonResponse<IRegisterUserResponseDTO | IApiError[]>;

class RegisterUserAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}
    
    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = registerUserValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const guid = crypto.randomUUID();

        const command = new RegisterUserCommand({
            id: guid,
            name: dto.name,
            email: dto.email,
            password: dto.password
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.CREATED,
            body: {
                id: guid
            },
        });
    }


    bind(request: Request): ActionRequest {
        return {
            dto: {
                name: request.body.name,
                email: request.body.email,
                password: request.body.password
            },
        };
    }
}

export default RegisterUserAction;
