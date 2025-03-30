import IApiError from "api/errors/IApiError";
import JsonResponse from "api/responses/JsonResponse";
import { SendEmailRequestDTO } from "../../../../types/api/contracts/other/send-email/SendEmailRequestDTO";
import { SendEmailResponseDTO } from "../../../../types/api/contracts/other/send-email/SendEmailResponseDTO";
import IAction from "../IAction";
import { Request } from "express";
import IEmailService from "api/interfaces/IEmailService";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import { SendEmailRequestDTOValidator } from "api/utils/validators";
import ApiErrorFactory from "api/errors/ApiErrorFactory";
import { StatusCodes } from "http-status-codes";
import { ReadRealEstateListingQuery } from "application/handlers/realEstateListings/ReadRealEstateListingQueryHandler";
import API_ERROR_CODES from "api/errors/API_ERROR_CODES";

type ActionRequest = { dto: SendEmailRequestDTO };
type ActionResponse = JsonResponse<SendEmailResponseDTO | IApiError[]>;

class SendEmailAction implements IAction<ActionRequest, ActionResponse> {
    constructor(
        private readonly requestDispatcher: IRequestDispatcher,
        private readonly emailService: IEmailService,
    ) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const isValid = SendEmailRequestDTOValidator(dto);
        if (!isValid) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapAjvErrors(SendEmailRequestDTOValidator.errors),
            });
        }

        const query = new ReadRealEstateListingQuery({ id: dto.realEstateListingId });
        const result = await this.requestDispatcher.dispatch(query);
        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        const listing = result.value;
        if (listing == null) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.createSingleErrorList({ message: `Listing of Id "${dto.realEstateListingId}" does not exist.`, path: "_", code: API_ERROR_CODES.VALIDATION_ERROR }),
            });
        }

        this.emailService.sendRealEstateListingInquiryEmail({ inquiry: dto.inquiry, listing: listing, email: dto.email });

        return new JsonResponse({
            status: StatusCodes.OK,
            body: {},
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                email: request.body.email,
                inquiry: request.body.inquiry,
                realEstateListingId: request.body.realEstateListingId,
            },
        };
    }
}

export default SendEmailAction;
