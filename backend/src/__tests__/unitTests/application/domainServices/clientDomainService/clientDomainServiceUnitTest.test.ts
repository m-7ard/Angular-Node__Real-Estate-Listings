import { createClientRepositoryMock, createUnitOfWorkMock } from "__mocks__/mocks";
import Mixins from "__utils__/unitTests/Mixins";
import CannotCreateClientError from "application/errors/domain/client/CannotCreateClientError";
import CannotUpdateClient from "application/errors/services/clientDomainService/CannotUpdateClient";
import IClientRepository from "application/interfaces/persistence/IClientRepository";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import ClientDomainService from "application/services/domainServices/ClientDomainService";
import Client from "domain/entities/Client";
import ClientType from "domain/valueObjects/Client/ClientType";


let handler: ClientDomainService;
let CLIENT_001: Client;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>
let mockClientRepo: jest.Mocked<IClientRepository>;

beforeAll(() => {
});

afterAll(() => {
});

beforeEach(() => {
    CLIENT_001 = Mixins.createClient(1);
    mockUnitOfWork = createUnitOfWorkMock();

    mockClientRepo = createClientRepositoryMock()
    mockUnitOfWork.clientRepo = mockClientRepo;

    handler = new ClientDomainService(mockUnitOfWork);
});

describe("clientDomainServiceUnitTest.test/tryOrchestractCreateNewClient;", () => {
    it("Try Orchestrate Create New Client; Valid Data; Success;", async () => {
        // Setup
        
        // Act
        const result = await handler.tryOrchestractCreateNewClient({ "id": "id", "name": "name", "type": ClientType.PRIVATE.value })
        // Assert
        expect(result.isOk());
    });

    it("Try Orchestrate Create New Client; Invalid Status; Failure;", async () => {
        // Setup

        // Act
        const result = await handler.tryOrchestractCreateNewClient({ "id": "id", "name": "name", "type": "bunk_status" });
        
        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotCreateClientError);
    });
});

describe("clientDomainServiceUnitTest.test/tryGetById;", () => {
    it("Try Get By Id; User Does Exist; Success;", async () => {
        // Setup
        mockClientRepo.getByIdAsync.mockImplementationOnce(async () => CLIENT_001);

        // Act
        const result = await handler.tryGetById("id")
        
        // Assert
        expect(result.isOk());
    });

    it("Try Get By Id; Client Does Not Exist; Failure;", async () => {
        // Setup
        mockClientRepo.getByIdAsync.mockImplementationOnce(async () => null);

        // Act
        const result = await handler.tryGetById("id");

        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotCreateClientError);
    });
});

describe("clientDomainServiceUnitTest.test/tryOrchestractUpdateClient;", () => {
    it("Try Orchestrate Update Client; Valid Data; Success;", async () => {
        // Setup
        
        // Act
        const result = await handler.tryOrchestractUpdateClient(CLIENT_001, { "name": "name", "type": ClientType.PRIVATE.value })
        
        // Assert
        expect(result.isOk());
    });

    it("Try Orchestrate Update Client; Invalid Status; Failure;", async () => {
        // Setup

        // Act
        const result = await handler.tryOrchestractUpdateClient(CLIENT_001, { "name": "name", "type": "bunk_status" });
        
        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotUpdateClient);
    });
});