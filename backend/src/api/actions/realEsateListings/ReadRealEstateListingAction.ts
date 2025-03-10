import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { ReadRealEstateListingQuery } from "application/handlers/realEstateListings/ReadRealEstateListingQueryHandler";
import { ReadRealEstateListingRequestDTO } from "../../../../types/api/contracts/realEstateListings/read/ReadRealEstateListingRequestDTO";
import { ReadRealEstateListingResponseDTO } from "../../../../types/api/contracts/realEstateListings/read/ReadRealEstateListingResponseDTO";
import ApiModelMapper from "api/mappers/ApiModelMapper";

type ActionRequest = { dto: ReadRealEstateListingRequestDTO; id: string };
type ActionResponse = JsonResponse<ReadRealEstateListingResponseDTO | IApiError[]>;

class ReadRealEstateListingAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, id } = request;

        const query = new ReadRealEstateListingQuery({
            id: id,
        });
        const result = await this._requestDispatcher.dispatch(query);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        const listing = result.value;

        if (listing == null) {
            return new JsonResponse({
                status: StatusCodes.NOT_FOUND,
                body: ApiErrorFactory.mapApplicationErrors([]),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                listing: ApiModelMapper.createRealEstateListingApiModel(listing)
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

export default ReadRealEstateListingAction;
