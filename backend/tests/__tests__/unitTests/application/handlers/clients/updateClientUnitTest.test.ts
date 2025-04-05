import Mixins from "../../../../../__utils__/unitTests/Mixins";
import { emptyApplicationError } from "../../../../../__utils__/values/emptyApplicationError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import CannotUpdateClient from "application/errors/services/clientDomainService/CannotUpdateClient";
import UpdateClientCommandHandler, { UpdateClientCommand } from "application/handlers/clients/UpdateClientCommandHandler";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import Client from "domain/entities/Client";
import ClientType from "domain/valueObjects/Client/ClientType";
import { err, ok } from "neverthrow";
import { createUnitOfWorkMock, createClientDomainServiceMock } from "../../../../../__mocks__/mocks";

let DEFAULT_REQUEST: UpdateClientCommand;
let CLIENT_001: Client;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
let mockClientDomainService: jest.Mocked<IClientDomainService>;
let handler: UpdateClientCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_REQUEST = new UpdateClientCommand({ id: "id", name: "name", type: ClientType.CORPORATE.value });
    mockUnitOfWork = createUnitOfWorkMock();
    mockClientDomainService = createClientDomainServiceMock();
    CLIENT_001 = Mixins.createClient(1);

    handler = new UpdateClientCommandHandler(mockUnitOfWork, mockClientDomainService);
});

describe("updateClientUnitTest.test;", () => {
    it("Update Client; Valid Data; Success;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockClientDomainService.tryOrchestractUpdateClient.mockImplementationOnce(async () => ok(true));

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
    });

    it("Update Client; Client Does Not Exist; Failure;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof ClientDoesNotExistError);
    });

    it("Update Client; Cannot Update Client; Failure;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));
        mockClientDomainService.tryOrchestractUpdateClient.mockImplementationOnce(async () => err(emptyApplicationError));

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotUpdateClient);
    });
});
