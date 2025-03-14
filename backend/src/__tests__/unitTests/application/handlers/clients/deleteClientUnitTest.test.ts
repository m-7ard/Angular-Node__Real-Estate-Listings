import { createClientDomainServiceMock, createRealEstateListingDomainServiceMock, createRealEstateListingRepositoryMock, createUnitOfWorkMock } from "__mocks__/mocks";
import Mixins from "__utils__/unitTests/Mixins";
import { emptyApplicationError } from "__utils__/values/emptyApplicationError";
import CannotDeleteClientError from "application/errors/application/clients/CannotDeleteClientError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import DeleteClientCommandHandler, { DeleteClientCommand } from "application/handlers/clients/DeleteClientCommandHandler";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IRealEstateListingRepository from "application/interfaces/persistence/IRealEstateListingRepository";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import { err, ok } from "neverthrow";

let DEFAULT_REQUEST: DeleteClientCommand;
let CLIENT_001: Client;
let REAL_ESTATE_LISTING_001: RealEstateListing;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
let mockClientDomainService: jest.Mocked<IClientDomainService>;
let mockRealEstateListingDomainService: jest.Mocked<IRealEstateListingDomainService>;
let mockRealEstateListingRepository: jest.Mocked<IRealEstateListingRepository>;
let handler: DeleteClientCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_REQUEST = new DeleteClientCommand({ id: "id", force: false });

    mockUnitOfWork = createUnitOfWorkMock();
    mockRealEstateListingRepository = createRealEstateListingRepositoryMock();
    mockUnitOfWork.realEstateListingRepo = mockRealEstateListingRepository;

    mockClientDomainService = createClientDomainServiceMock();
    mockRealEstateListingDomainService = createRealEstateListingDomainServiceMock();

    CLIENT_001 = Mixins.createClient(1);
    REAL_ESTATE_LISTING_001 = Mixins.createRealEstateListing(1, CLIENT_001);

    handler = new DeleteClientCommandHandler(mockUnitOfWork, mockClientDomainService, mockRealEstateListingDomainService);
});

describe("deleteClientUnitTest.test;", () => {
    it("Delete Client; Valid Data (Does Not Have Listing); Success;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockRealEstateListingRepository.filterAsync.mockImplementationOnce(async () => []);

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
    });

    it("Delete Client; Valid Data (Does Have Listing + Force); Success;", async () => {
        // Setup
        DEFAULT_REQUEST.force = true;
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockRealEstateListingRepository.filterAsync.mockImplementationOnce(async () => [REAL_ESTATE_LISTING_001]);

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
    });

    it("Delete Client; Client Does Not Exist; Failure;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof ClientDoesNotExistError);
    });

    it("Delete Client; Cannot Delete Client (Does Have Listings); Failure;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockRealEstateListingRepository.filterAsync.mockImplementationOnce(async () => [REAL_ESTATE_LISTING_001]);

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotDeleteClientError);
    });
});
