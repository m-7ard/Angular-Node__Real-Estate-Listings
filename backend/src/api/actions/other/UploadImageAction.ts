import IAction from "../IAction";
import JsonResponse from "../../responses/JsonResponse";
import { StatusCodes } from "http-status-codes";
import IApiError from "api/errors/IApiError";
import { StaticDataRequestDTO } from "../../../../types/api/contracts/other/static-data/StaticDataRequestDTO";
import { StaticDataResponseDTO } from "../../../../types/api/contracts/other/static-data/StaticDataResponseDTO";
import ClientType from "domain/valueObjects/Client/ClientType";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

type ActionRequest = { dto: StaticDataRequestDTO };
type ActionResponse = JsonResponse<StaticDataResponseDTO | IApiError[]>;

class StaticDataAction implements IAction<ActionRequest, ActionResponse> {
    async handle(): Promise<ActionResponse> {
        return new JsonResponse({
            status: StatusCodes.OK,
            body: {
                clientTypes: {
                    [ClientType.CORPORATE.value]: "Corporate",
                    [ClientType.PRIVATE.value]: "Private",
                },
                realEstateListingTypes: {
                    [RealEstateListingType.APARTMENT.value]: "Apartment",
                    [RealEstateListingType.HOUSE.value]: "House",
                },
            },
        });
    }

    bind(): ActionRequest {
        return {
            dto: {},
        };
    }
}

export default StaticDataAction;
