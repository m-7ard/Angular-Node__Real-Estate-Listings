import CannotCreateNewClient from "application/errors/services/clientDomainService/CannotCreateNewClient";
import CreateClientCommandHandler, { CreateClientCommand } from "application/handlers/clients/CreateClientCommandHandler";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import Client from "domain/entities/Client";
import ClientType from "domain/valueObjects/Client/ClientType";
import { err, ok } from "neverthrow";
import Mixins from "../../../../../__utils__/unitTests/Mixins";
import { createUnitOfWorkMock, createClientDomainServiceMock } from "../../../../../__mocks__/mocks";
import { emptyApplicationError } from "../../../../../__utils__/values/emptyApplicationError";

let DEFAULT_REQUEST: CreateClientCommand;
let CLIENT_001: Client;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
let mockClientDomainService: jest.Mocked<IClientDomainService>;
let handler: CreateClientCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_REQUEST = new CreateClientCommand({ id: "id", name: "name", type: ClientType.CORPORATE.value });
    mockUnitOfWork = createUnitOfWorkMock();
    mockClientDomainService = createClientDomainServiceMock();
    CLIENT_001 = Mixins.createClient(1);

    handler = new CreateClientCommandHandler(mockUnitOfWork, mockClientDomainService);
});

describe("createClientUnitTest.test;", () => {
    it("Current Client; Valid Data; Success;", async () => {
        mockClientDomainService.tryOrchestractCreateNewClient.mockImplementationOnce(async () => ok(CLIENT_001));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isOk());
    });

    it("Current Client; Cannot Create Client; Failure;", async () => {
        mockClientDomainService.tryOrchestractCreateNewClient.mockImplementationOnce(async () => err(emptyApplicationError));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotCreateNewClient);
    });
});
