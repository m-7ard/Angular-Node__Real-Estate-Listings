import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { DeleteManyRealEstateListingsRequestDTO } from "../../../../types/api/contracts/realEstateListings/deleteMany/DeleteManyRealEstateListingsRequestDTO";
import { DeleteManyRealEstateListingsResponseDTO } from "../../../../types/api/contracts/realEstateListings/deleteMany/DeleteManyRealEstateListingsResponseDTO";
import { DeleteManyRealEstateListingsCommand } from "application/handlers/realEstateListings/DeleteManyRealEstateListingsCommandHandler";
import { DeleteManyRealEstateListingsRequestDTOValidator } from "api/utils/validators";

type ActionRequest = { dto: DeleteManyRealEstateListingsRequestDTO; };
type ActionResponse = JsonResponse<DeleteManyRealEstateListingsResponseDTO | IApiError[]>;

class DeleteManyRealEstateListingsAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const isValid = DeleteManyRealEstateListingsRequestDTOValidator(dto);
        if (!isValid) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapAjvErrors(DeleteManyRealEstateListingsRequestDTOValidator.errors),
            });
        }

        const command = new DeleteManyRealEstateListingsCommand({
            ids: dto.ids,
        });
        const result = await this._requestDispatcher.dispatch(command);

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
                ids: typeof request.query.ids === "string" ? request.query.ids.split(",") : null as any,
            },
        };
    }
}

export default DeleteManyRealEstateListingsAction;
