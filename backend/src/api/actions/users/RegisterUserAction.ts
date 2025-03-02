import IRegisterUserRequestDTO from "api/DTOs/users/register/IRegisterUserRequestDTO";
import IRegisterUserResponseDTO from "api/DTOs/users/register/IRegisterUserResponseDTO";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { RegisterUserCommand } from "application/handlers/users/RegisterUserCommandHandler";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import { Request } from "express";

type ActionRequest = { dto: IRegisterUserRequestDTO };
type ActionResponse = JsonResponse<IRegisterUserResponseDTO | IApiError[]>;

class RegisterUserAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly requestDispatcher: IRequestDispatcher) {}
    
    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const guid = crypto.randomUUID();

        const command = new RegisterUserCommand({
            id: guid,
            name: dto.name,
            email: dto.email,
            password: dto.password
        });

        const result = await this.requestDispatcher.dispatch(command);

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
