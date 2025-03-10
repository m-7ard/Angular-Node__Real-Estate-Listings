import { Request } from "express";
import IAction, { TValidateResult } from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { CreateClientRequestDTO } from "../../../../types/api/contracts/clients/create/CreateClientRequestDTO";
import { CreateClientResponseDTO } from "../../../../types/api/contracts/clients/create/CreateClientResponseDTO";
import { CreateClientRequestDTOValidator } from "api/utils/validators";
import { CreateClientCommand } from "application/handlers/clients/CreateClientCommandHandler";

type ActionRequest = { dto: CreateClientRequestDTO };
type ActionResponse = JsonResponse<CreateClientResponseDTO | IApiError[]>;

class CreateClientAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const isValid = CreateClientRequestDTOValidator(dto);
        if (!isValid) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapAjvErrors(CreateClientRequestDTOValidator.errors),
            });
        }

        const guid = crypto.randomUUID();

        const command = new CreateClientCommand({
            id: guid,
            name: dto.name,
            type: dto.type
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
                id: guid,
            },
        });
    }

    validate(request: Request): TValidateResult {
        const validate = CreateClientRequestDTOValidator(request.body);
        if (!validate) return { ok: false, errors: ApiErrorFactory.mapAjvErrors(CreateClientRequestDTOValidator.errors) };
        return { ok: true, errors: [] };
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                name: request.body.name,
                type: request.body.type
            },
        };
    }
}

export default CreateClientAction;
