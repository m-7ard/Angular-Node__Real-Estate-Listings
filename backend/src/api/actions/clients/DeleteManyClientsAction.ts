import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import { DeleteManyClientsCommand } from "application/handlers/clients/DeleteManyClientsCommandHandler";
import { DeleteManyClientsRequestDTO } from "../../../../types/api/contracts/clients/deleteMany/DeleteManyClientsRequestDTO";
import { DeleteManyClientsResponseDTO } from "../../../../types/api/contracts/clients/deleteMany/DeleteManyClientsResponseDTO";

type ActionRequest = { dto: DeleteManyClientsRequestDTO };
type ActionResponse = JsonResponse<DeleteManyClientsResponseDTO | IApiError[]>;

class DeleteManyClientsAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const command = new DeleteManyClientsCommand({
            ids: dto.ids,
            force: dto.force,
        });
        const result = await this.requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {},
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                force: request.body.force,
                ids: typeof request.query.ids === "string" ? request.query.ids.split(",") : null as any,
            },
        };
    }
}

export default DeleteManyClientsAction;
