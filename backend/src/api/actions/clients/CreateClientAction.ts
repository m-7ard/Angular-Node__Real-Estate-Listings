import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { CreateClientRequestDTO } from "../../../../types/api/contracts/clients/create/CreateClientRequestDTO";

type ActionRequest = { dto: CreateClientRequestDTO };
type ActionResponse = JsonResponse<ICreateClientResponseDTO | IApiError[]>;

class CreateClientAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}
    
    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = CreateClientValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.superstructFailureToApiErrors(validation.error),
            });
        }

        const guid = crypto.randomUUID();

        const command = new CreateClientCommand({
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

export default CreateClientAction;
