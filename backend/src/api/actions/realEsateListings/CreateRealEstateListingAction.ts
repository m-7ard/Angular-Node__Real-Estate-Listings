import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { CreateRealEstateListingCommand } from "application/handlers/realEstateListings/CreateRealEstateListingCommandHandler";
import { CreateRealEstateListingRequestDTO } from "../../../../types/api/contracts/realEstateListings/create/CreateRealEstateListingRequestDTO";
import { CreateRealEstateListingResponseDTO } from "../../../../types/api/contracts/realEstateListings/create/CreateRealEstateListingResponseDTO";
import { CreateRealEstateListingRequestDTOValidator } from "api/utils/validators";

type ActionRequest = { dto: CreateRealEstateListingRequestDTO };
type ActionResponse = JsonResponse<CreateRealEstateListingResponseDTO | IApiError[]>;

class CreateRealEstateListingAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const isValid = CreateRealEstateListingRequestDTOValidator(dto);
        if (!isValid) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapAjvErrors(CreateRealEstateListingRequestDTOValidator.errors),
            });
        }

        const guid = crypto.randomUUID();

        const command = new CreateRealEstateListingCommand({
            id: guid,
            city: dto.city,
            clientId: dto.clientId,
            country: dto.country,
            price: dto.price,
            state: dto.state,
            street: dto.street,
            type: dto.type,
            zip: dto.zip
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

    bind(request: Request): ActionRequest {
        return {
            dto: {
                city: JSON.stringify(request.body.city),
                clientId: JSON.stringify(request.body.clientId),
                country: JSON.stringify(request.body.country),
                price: typeof request.body.price === "number" && Number.isFinite(request.body.price) ? request.body.price : -1,
                state: JSON.stringify(request.body.state),
                street: JSON.stringify(request.body.street),
                type: JSON.stringify(request.body.type),
                zip: JSON.stringify(request.body.zip),
            },
        };
    }
}

export default CreateRealEstateListingAction;
