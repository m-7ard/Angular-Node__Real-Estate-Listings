import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import loginUserValidator from "api/validators/users/loginUserValidator";
import { LoginUserQuery } from "application/handlers/users/LoginUserQueryHandler";
import ILoginUserRequestDTO from "api/DTOs/users/login/ILoginUserRequestDTO";
import ILoginUserResponseDTO from "api/DTOs/users/login/ILoginUserResponseDTO";
import IHttpService from "api/interfaces/IHttpRequestService";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";

type ActionRequest = { dto: ILoginUserRequestDTO };
type ActionResponse = JsonResponse<ILoginUserResponseDTO | IApiError[]>;

class LoginUserAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher, private readonly _httpService: IHttpService) {}
    
    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = loginUserValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const command = new LoginUserQuery({
            email: dto.email,
            password: dto.password
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const [firstError] = result.error;

            if (firstError.code === APPLICATION_ERROR_CODES.OperationFailed) {
                return new JsonResponse({
                    status: StatusCodes.INTERNAL_SERVER_ERROR,
                    body: ApiErrorFactory.mapApplicationErrors(result.error),
                });
            }

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
