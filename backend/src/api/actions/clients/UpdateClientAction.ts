import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { UpdateClientCommand } from "application/handlers/clients/UpdateClientCommandHandler";
import { UpdateClientRequestDTO } from "../../../../types/api/contracts/clients/update/UpdateClientRequestDTO";
import { UpdateClientResponseDTO } from "../../../../types/api/contracts/clients/update/UpdateClientResponseDTO";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import { UpdateClientRequestDTOValidator } from "api/utils/validators";

type ActionRequest = { id: string; dto: UpdateClientRequestDTO;  };
type ActionResponse = JsonResponse<UpdateClientResponseDTO | IApiError[]>;

class UpdateClientAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, id } = request;

        const isValid = UpdateClientRequestDTOValidator(dto);
        if (!isValid) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapAjvErrors(UpdateClientRequestDTOValidator.errors),
            });
        }

        const command = new UpdateClientCommand({
            id: id,
            name: dto.name,
            type: dto.type
        });
        const result = await this._requestDispatcher.dispatch(command);

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
            body: {
                id: id,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            id: request.params.id,
            dto: {
                name: request.body.name,
                type: request.body.type
            },
        };
    }
}

export default UpdateClientAction;
