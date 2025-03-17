import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import IHttpService from "api/interfaces/IHttpRequestService";
import { CurrentUserQuery } from "application/handlers/users/CurrentUserQueryHandler";
import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import InvalidJwtTokenError from "application/errors/other/InvalidJwtTokenError";
import { CurrentUserResponseDTO } from "../../../../types/api/contracts/users/currentUser/CurrentUserResponseDTO";
import { CurrentUserRequestDTO } from "../../../../types/api/contracts/users/currentUser/CurrentUserRequestDTO";

type ActionRequest = { dto: CurrentUserRequestDTO };
type ActionResponse = JsonResponse<CurrentUserResponseDTO | IApiError[]>;

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

            if (firstError instanceof InvalidJwtTokenError) {
                return new JsonResponse({
                    status: StatusCodes.UNAUTHORIZED,
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
        return { dto: {} };
    }
}

export default CurrentUserAction;
