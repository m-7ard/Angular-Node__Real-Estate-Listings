import ILoginUserRequestDTO from "api/DTOs/users/login/ILoginUserRequestDTO";
import ILoginUserResponseDTO from "api/DTOs/users/login/ILoginUserResponseDTO";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IApiError from "api/errors/IApiError";
import IHttpService from "api/interfaces/IHttpRequestService";
import JsonResponse from "api/responses/JsonResponse";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { LoginUserQuery } from "application/handlers/users/LoginUserQueryHandler";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import IAction from "../IAction";
import UserDoesNotExist from "application/errors/application/users/UserDoesNotExist";


type ActionRequest = { dto: ILoginUserRequestDTO };
type ActionResponse = JsonResponse<ILoginUserResponseDTO | IApiError[]>;

class LoginUserAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher, private readonly _httpService: IHttpService) {}
    
    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const command = new LoginUserQuery({
            email: dto.email,
            password: dto.password
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const [firstError] = result.error;

            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                token: result.value.jwtToken
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                email: request.body.email,
                password: request.body.password
            },
        };
    }
}

export default LoginUserAction;
