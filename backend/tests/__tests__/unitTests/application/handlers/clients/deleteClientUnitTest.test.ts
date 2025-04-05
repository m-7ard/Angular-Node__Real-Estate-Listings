import Mixins from "../../../../../__utils__/unitTests/Mixins";
import { emptyApplicationError } from "../../../../../__utils__/values/emptyApplicationError";
import CannotDeleteClientError from "application/errors/domain/client/CannotDeleteClientError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import DeleteManyClientsCommandHandler, { DeleteManyClientsCommand } from "application/handlers/clients/DeleteManyClientsCommandHandler";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IRealEstateListingRepository from "application/interfaces/persistence/IRealEstateListingRepository";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import { err, ok } from "neverthrow";
import { createUnitOfWorkMock, createRealEstateListingRepositoryMock, createClientDomainServiceMock, createRealEstateListingDomainServiceMock } from "../../../../../__mocks__/mocks";

let DEFAULT_REQUEST: DeleteManyClientsCommand;
let CLIENT_001: Client;
let REAL_ESTATE_LISTING_001: RealEstateListing;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
let mockClientDomainService: jest.Mocked<IClientDomainService>;
let mockRealEstateListingDomainService: jest.Mocked<IRealEstateListingDomainService>;
let mockRealEstateListingRepository: jest.Mocked<IRealEstateListingRepository>;
let handler: DeleteManyClientsCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {

    mockUnitOfWork = createUnitOfWorkMock();
    mockRealEstateListingRepository = createRealEstateListingRepositoryMock();
    mockUnitOfWork.realEstateListingRepo = mockRealEstateListingRepository;

    mockClientDomainService = createClientDomainServiceMock();
    mockRealEstateListingDomainService = createRealEstateListingDomainServiceMock();

    CLIENT_001 = Mixins.createClient(1);
    REAL_ESTATE_LISTING_001 = Mixins.createRealEstateListing(1, CLIENT_001);
    DEFAULT_REQUEST = new DeleteManyClientsCommand({ ids: [CLIENT_001.id.value], force: false });

    handler = new DeleteManyClientsCommandHandler(mockUnitOfWork, mockClientDomainService);
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

    it("Delete Client; Client Does Not Exist (rollback is called); Failure;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isErr());
        expect(mockUnitOfWork.rollbackTransaction).toHaveBeenCalled();
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
