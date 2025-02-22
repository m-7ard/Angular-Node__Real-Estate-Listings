import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ICurrentUserResponseDTO from "api/DTOs/users/get-current/ICurrentUserResponseDTO";
import IHttpService from "api/interfaces/IHttpRequestService";
import { CurrentUserQuery } from "application/handlers/users/CurrentUserQueryHandler";
import APPLICATION_ERROR_CODES from "application/errors/VALIDATION_ERROR_CODES";
import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import ApiModelMapper from "api/mappers/ApiModelMapper";

type ActionRequest = {};
type ActionResponse = JsonResponse<ICurrentUserResponseDTO | IApiError[]>;

class CurrentUserAction implements IAction<ActionRequest, ActionResponse> {
    constructor(
        private readonly _requestDispatcher: IRequestDispatcher,
        private readonly _httpService: IHttpService,
    ) {}

    async handle(): Promise<ActionResponse> {
        const jwtToken = this._httpService.readJwtToken();
        if (jwtToken == null) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: [{ code: API_ERROR_CODES.VALIDATION_ERROR, message: "jwtToken missing from request.", path: "_" }],
            });
        }

        const query = new CurrentUserQuery({ token: jwtToken });
        const result = await this._requestDispatcher.dispatch(query);

        if (result.isErr()) {
            const [firstError] = result.error;
            if (firstError.code === APPLICATION_ERROR_CODES.OperationFailed) {
                return new JsonResponse({
                    status: StatusCodes.BAD_REQUEST,
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
                user: result.value == null ? null : ApiModelMapper.createUserApiModel(result.value),
            },
        });
    }

    bind(): ActionRequest {
        return {};
    }
}

export default CurrentUserAction;
