import { createClientDomainServiceMock, createRealEstateListingDomainServiceMock, createUnitOfWorkMock } from "__mocks__/mocks";
import Mixins from "__utils__/unitTests/Mixins";
import { emptyApplicationError } from "__utils__/values/emptyApplicationError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import CannotCreateNewListingServiceError from "application/errors/services/realEstateListingDomainService/CannotCreateNewListingServiceError";
import CreateRealEstateListingCommandHandler, { CreateRealEstateListingCommand } from "application/handlers/realEstateListings/CreateRealEstateListingCommandHandler";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";
import { err, ok } from "neverthrow";

let DEFAULT_REQUEST: CreateRealEstateListingCommand;
let CLIENT_001: Client;
let LISTING_001: RealEstateListing;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
let mockClientDomainService: jest.Mocked<IClientDomainService>;
let mockRealEstateListingDomainService: jest.Mocked<IRealEstateListingDomainService>;
let handler: CreateRealEstateListingCommandHandler;

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
    });
    mockUnitOfWork = createUnitOfWorkMock();
    mockClientDomainService = createClientDomainServiceMock();
    mockRealEstateListingDomainService = createRealEstateListingDomainServiceMock();
    CLIENT_001 = Mixins.createClient(1);
    LISTING_001 = Mixins.createRealEstateListing(1, CLIENT_001);

    handler = new CreateRealEstateListingCommandHandler(mockUnitOfWork, mockRealEstateListingDomainService, mockClientDomainService);
});

describe("createRealEstateListingUnitTest.test;", () => {
    it("Create Listing; Valid Data; Success;", async () => {
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockRealEstateListingDomainService.tryOrchestractCreateNewListing.mockImplementationOnce(async () => ok(LISTING_001));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isOk());
    });

    it("Create Listing; Client Does Not Exist; Failure;", async () => {
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof ClientDoesNotExistError);
    });

    it("Create Listing; Cannot Create New Listing; Failure;", async () => {
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockRealEstateListingDomainService.tryOrchestractCreateNewListing.mockImplementationOnce(async () => err(emptyApplicationError));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotCreateNewListingServiceError);
    });
});
