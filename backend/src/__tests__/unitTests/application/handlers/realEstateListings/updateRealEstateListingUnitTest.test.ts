import { createClientDomainServiceMock, createRealEstateListingDomainServiceMock, createUnitOfWorkMock } from "__mocks__/mocks";
import Mixins from "__utils__/unitTests/Mixins";
import { emptyApplicationError } from "__utils__/values/emptyApplicationError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import RealEstateListingDoesNotExistError from "application/errors/application/realEstateListings/RealEstateListingDoesNotExistError";
import CannotUpdateListingServiceError from "application/errors/services/realEstateListingDomainService/CannotUpdateListingServiceError";
import { CreateRealEstateListingCommand } from "application/handlers/realEstateListings/CreateRealEstateListingCommandHandler";
import UpdateRealEstateListingCommandHandler, { UpdateRealEstateListingCommand } from "application/handlers/realEstateListings/UpdateRealEstateListingCommandHandler";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";
import { err, ok } from "neverthrow";

let DEFAULT_REQUEST: UpdateRealEstateListingCommand;
let CLIENT_001: Client;
let LISTING_001: RealEstateListing;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
let mockClientDomainService: jest.Mocked<IClientDomainService>;
let mockRealEstateListingDomainService: jest.Mocked<IRealEstateListingDomainService>;
let handler: UpdateRealEstateListingCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_REQUEST = new CreateRealEstateListingCommand({
        id: "id",
        city: "city",
        clientId: "clientId",
        country: "country",
        price: 1,
        state: "state",
        street: "street",
        type: RealEstateListingType.APARTMENT.value,
        zip: "zip",
        info: {
            squareMeters: 1,
            yearBuilt: 2025,
            bathroomNumber: 1,
            bedroomNumber: 1,
            description: "description",
            flooringType: "flooringType",
        },
        title: "title"
    });
    mockUnitOfWork = createUnitOfWorkMock();
    mockClientDomainService = createClientDomainServiceMock();
    mockRealEstateListingDomainService = createRealEstateListingDomainServiceMock();
    CLIENT_001 = Mixins.createClient(1);
    LISTING_001 = Mixins.createRealEstateListing(1, CLIENT_001);

    handler = new UpdateRealEstateListingCommandHandler(mockUnitOfWork, mockRealEstateListingDomainService, mockClientDomainService);
});

describe("updateRealEstateListingUnitTest.test;", () => {
    it("Update Listing; Valid Data; Success;", async () => {
        mockRealEstateListingDomainService.tryGetById.mockImplementationOnce(async () => ok(LISTING_001));
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockRealEstateListingDomainService.tryOrchestractUpdateListing.mockImplementationOnce(async () => ok(true));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isOk());
    });

    it("Update Listing; Listing Does Not Exist; Failure;", async () => {
        mockRealEstateListingDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof RealEstateListingDoesNotExistError);
    });

    it("Update Listing; Client Does Not Exist; Failure;", async () => {
        mockRealEstateListingDomainService.tryGetById.mockImplementationOnce(async () => ok(LISTING_001));
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof ClientDoesNotExistError);
    });

    it("Update Listing; Cannot Update Listing; Failure;", async () => {
        mockRealEstateListingDomainService.tryGetById.mockImplementationOnce(async () => ok(LISTING_001));
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockRealEstateListingDomainService.tryOrchestractUpdateListing.mockImplementationOnce(async () => err(emptyApplicationError));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotUpdateListingServiceError);
    });
});
