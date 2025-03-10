import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { ReadClientRequestDTO } from "../../../../types/api/contracts/clients/read/ReadClientRequestDTO";
import { ReadClientResponseDTO } from "../../../../types/api/contracts/clients/read/ReadClientResponseDTO";
import { ReadClientQuery } from "application/handlers/clients/ReadClientQueryHandler";
import ApiModelMapper from "api/mappers/ApiModelMapper";

type ActionRequest = { id: string; dto: ReadClientRequestDTO };
type ActionResponse = JsonResponse<ReadClientResponseDTO | IApiError[]>;

class ReadClientAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, id } = request;

        const command = new ReadClientQuery({
            id: id,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        const client = result.value;

        if (client == null) {
            return new JsonResponse({
                status: StatusCodes.NOT_FOUND,
                body: [],
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                client: ApiModelMapper.createClientApiModel(client),
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            id: request.params.id,
            dto: {},
        };
    }
}

export default ReadClientAction;
