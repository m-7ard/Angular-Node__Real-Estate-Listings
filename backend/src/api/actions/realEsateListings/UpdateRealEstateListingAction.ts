import { Request } from "express";
import IAction from "../IAction";
import IRequestDispatcher from "../../../application/handlers/IRequestDispatcher";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { UpdateRealEstateListingCommand } from "application/handlers/realEstateListings/UpdateRealEstateListingCommandHandler";
import { UpdateRealEstateListingRequestDTOValidator } from "api/utils/validators";
import { UpdateRealEstateListingRequestDTO } from "../../../../types/api/contracts/realEstateListings/update/UpdateRealEstateListingRequestDTO";
import { UpdateRealEstateListingResponseDTO } from "../../../../types/api/contracts/realEstateListings/update/UpdateRealEstateListingResponseDTO";
import RealEstateListingDoesNotExistError from "application/errors/application/realEstateListings/RealEstateListingDoesNotExistError";

type ActionRequest = { dto: UpdateRealEstateListingRequestDTO; id: string };
type ActionResponse = JsonResponse<UpdateRealEstateListingResponseDTO | IApiError[]>;

class UpdateRealEstateListingAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto, id } = request;

        const isValid = UpdateRealEstateListingRequestDTOValidator(dto);
        if (!isValid) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapAjvErrors(UpdateRealEstateListingRequestDTOValidator.errors),
            });
        }

        const command = new UpdateRealEstateListingCommand({
            id: id,
            city: dto.city,
            clientId: dto.clientId,
            country: dto.country,
            price: dto.price,
            state: dto.state,
            street: dto.street,
            type: dto.type,
            zip: dto.zip,
            info: {
                squareMeters: dto.squareMeters,
                yearBuilt: dto.yearBuilt,
                bathroomNumber: dto.bathroomNumber,
                bedroomNumber: dto.bedroomNumber,
                description: dto.description,
                flooringType: dto.flooringType,
            },
            title: dto.title,
            images: dto.images
        });
        const result = await this._requestDispatcher.dispatch(command);

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
            body: {
                id: id,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            id: request.params.id,
            dto: {
                city: request.body.city,
                clientId: request.body.clientId,
                country: request.body.country,
                price: typeof request.body.price === "number" && Number.isFinite(request.body.price) ? request.body.price : -1,
                state: request.body.state,
                street: request.body.street,
                type: request.body.type,
                zip: request.body.zip,
                squareMeters: request.body.squareMeters,
                yearBuilt: request.body.yearBuilt,
                bathroomNumber: request.body.bathroomNumber,
                bedroomNumber: request.body.bedroomNumber,
                description: request.body.description,
                flooringType: request.body.flooringType,
                title: request.body.title,
                images: request.body.images
            },
        };
    }
}

export default UpdateRealEstateListingAction;
