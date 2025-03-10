import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import { ListClientsRequestDTO } from "../../../../types/api/contracts/clients/list/ListClientsRequestDTO";
import { ListClientsResponseDTO } from "../../../../types/api/contracts/clients/list/ListClientsResponseDTO";
import { FilterClientsQuery } from "application/handlers/clients/FilterClientsQueryHandler";

type ActionRequest = { dto: ListClientsRequestDTO };
type ActionResponse = JsonResponse<ListClientsResponseDTO | IApiError[]>;

class ListClientsAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const command = new FilterClientsQuery({
            id: dto.id,
            name: dto.name,
            type: dto.type,
        });
        
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        const clients = result.value;

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                clients: clients.map(ApiModelMapper.createClientApiModel),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                id: typeof request.query.id === "string" ? request.query.id : undefined,
                name: typeof request.query.name === "string" ? request.query.name : undefined,
                type: typeof request.query.type === "string" ? request.query.type : undefined,
            },
        };
    }
}

export default ListClientsAction;
