import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { DeleteManyClientsCommand } from "application/handlers/clients/DeleteManyClientsCommandHandler";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import { DeleteClientRequestDTO } from "../../../../types/api/contracts/clients/delete/DeleteClientRequestDTO";
import { DeleteClientResponseDTO } from "../../../../types/api/contracts/clients/delete/DeleteClientResponseDTO";

type ActionRequest = { id: string; dto: DeleteClientRequestDTO };
type ActionResponse = JsonResponse<DeleteClientResponseDTO | IApiError[]>;

class DeleteClientAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, id } = request;

        const command = new DeleteManyClientsCommand({
            ids: [id],
            force: dto.force,
        });
        const result = await this.requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const [firstError] = result.error;

            if (firstError instanceof ClientDoesNotExistError) {
                return new JsonResponse({
                    status: StatusCodes.NOT_FOUND,
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
            body: {},
        });
    }

    bind(request: Request): ActionRequest {
        return {
            id: request.params.id,
            dto: {
                force: request.body.force,
            },
        };
    }
}

export default DeleteClientAction;
