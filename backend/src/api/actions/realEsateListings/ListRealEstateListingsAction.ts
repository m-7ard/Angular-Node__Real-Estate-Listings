import { Request, response } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import { ListRealEstateListingsRequestDTO } from "../../../../types/api/contracts/realEstateListings/list/ListRealEstateListingsRequestDTO";
import { ListRealEstateListingsResponseDTO } from "../../../../types/api/contracts/realEstateListings/list/ListRealEstateListingsResponseDTO";
import { FilterRealEstateListingsQuery } from "application/handlers/realEstateListings/FilterRealEstateListingsQueryHandler";

type ActionRequest = { dto: ListRealEstateListingsRequestDTO; };
type ActionResponse = JsonResponse<ListRealEstateListingsResponseDTO | IApiError[]>;

class ListRealEstateListingsAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const query = new FilterRealEstateListingsQuery({
            city: dto.city,
            clientId: dto.clientId,
            country: dto.country,
            maxPrice: dto.maxPrice,
            minPrice: dto.minPrice,
            state: dto.state,
            type: dto.type,
            zip: dto.zip
        });
        const result = await this.requestDispatcher.dispatch(query);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                "listings": result.value.map(ApiModelMapper.createRealEstateListingApiModel)
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                city: typeof request.query.city === "string" ? request.query.city : undefined,
                clientId: typeof request.query.clientId === "string" ? request.query.clientId : undefined,
                country: typeof request.query.country === "string" ? request.query.country : undefined,
                maxPrice: typeof request.query.maxPrice === "number" ? request.query.maxPrice : undefined,
                minPrice: typeof request.query.minPrice === "number" ? request.query.minPrice : undefined,
                state: typeof request.query.state === "string" ? request.query.state : undefined,
                street: typeof request.query.street === "string" ? request.query.street : undefined,
                type: typeof request.query.type === "string" ? request.query.type : undefined,
                zip: typeof request.query.zip === "string" ? request.query.zip : undefined,
            },
        };
    }
}

export default ListRealEstateListingsAction;
