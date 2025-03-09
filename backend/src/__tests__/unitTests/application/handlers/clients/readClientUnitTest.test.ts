import { createClientDomainServiceMock } from "__mocks__/mocks";
import Mixins from "__utils__/unitTests/Mixins";
import { emptyApplicationError } from "__utils__/values/emptyApplicationError";
import ReadClientQueryHandler, { ReadClientQuery } from "application/handlers/clients/ReadClientQueryHandler";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import Client from "domain/entities/Client";
import { err, ok } from "neverthrow";

let DEFAULT_REQUEST: ReadClientQuery;
let CLIENT_001: Client;
let mockClientDomainService: jest.Mocked<IClientDomainService>;
let handler: ReadClientQueryHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_REQUEST = new ReadClientQuery({ id: "id" });

    mockClientDomainService = createClientDomainServiceMock();

    CLIENT_001 = Mixins.createClient(1);

    handler = new ReadClientQueryHandler(mockClientDomainService);
});

describe("readClientUnitTest.test;", () => {
    it("Read Client; User Exists; Success;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => ok(CLIENT_001));

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        const value = result.isOk() && result.value;
        expect(value).toEqual(CLIENT_001);
    });

    it("Read Client; User Does Not Exist; Success;", async () => {
        // Setup
        mockClientDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        const value = result.isOk() && result.value;
        expect(value).toEqual(null);
    });
});
