import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { DeleteManyRealEstateListingsCommand } from "application/handlers/realEstateListings/DeleteManyRealEstateListingsCommandHandler";
import { DeleteRealEstateListingRequestDTO } from "../../../../types/api/contracts/realEstateListings/delete/DeleteRealEstateListingRequestDTO";
import { DeleteRealEstateListingResponseDTO } from "../../../../types/api/contracts/realEstateListings/delete/DeleteRealEstateListingResponseDTO";
import RealEstateListingDoesNotExistError from "application/errors/application/realEstateListings/RealEstateListingDoesNotExistError";

type ActionRequest = { dto: DeleteRealEstateListingRequestDTO; id: string };
type ActionResponse = JsonResponse<DeleteRealEstateListingResponseDTO | IApiError[]>;

class DeleteRealEstateListingAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, id } = request;

        const command = new DeleteManyRealEstateListingsCommand({
            ids: [id],
        });
        const result = await this.requestDispatcher.dispatch(command);

        if (result.isErr()) {
            const [firstError] = result.error;

            if (firstError instanceof RealEstateListingDoesNotExistError) {
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
            dto: {},
        };
    }
}

export default DeleteRealEstateListingAction;
