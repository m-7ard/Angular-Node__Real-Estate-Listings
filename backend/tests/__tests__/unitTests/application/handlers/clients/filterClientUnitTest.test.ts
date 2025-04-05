import Mixins from "../../../../../__utils__/unitTests/Mixins";
import FilterClientsQueryHandler, { FilterClientsQuery } from "application/handlers/clients/FilterClientsQueryHandler";
import IClientRepository, { FilterClientsCriteria } from "application/interfaces/persistence/IClientRepository";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import ClientId from "domain/valueObjects/Client/ClientId";
import ClientType from "domain/valueObjects/Client/ClientType";
import { createClientRepositoryMock } from "../../../../../__mocks__/mocks";

let DEFAULT_REQUEST: FilterClientsQuery;
let CLIENT_001: Client;
let REAL_ESTATE_LISTING_001: RealEstateListing;
let mockClientRepository: jest.Mocked<IClientRepository>;
let handler: FilterClientsQueryHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    DEFAULT_REQUEST = new FilterClientsQuery({});

    mockClientRepository = createClientRepositoryMock();

    CLIENT_001 = Mixins.createClient(1);
    REAL_ESTATE_LISTING_001 = Mixins.createRealEstateListing(1, CLIENT_001);

    handler = new FilterClientsQueryHandler(mockClientRepository);
});

describe("filterClientUnitTest.test;", () => {
    it("Filter Clients; Empty Data; Success;", async () => {
        // Setup
        const expectedContract = new FilterClientsCriteria({});
        mockClientRepository.filterAsync.mockImplementationOnce(async () => []);

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        expect(expectedContract.equal(mockClientRepository.filterAsync.mock.calls[0]));
    });

    it("Filter Clients; Full Data; Success;", async () => {
        // Setup
        const expectedContract = new FilterClientsCriteria({
            id: ClientId.executeCreate("id"),
            name: "name",
            type: ClientType.PRIVATE,
        });
        mockClientRepository.filterAsync.mockImplementationOnce(async () => []);

        DEFAULT_REQUEST.id = expectedContract.id == null ? null : expectedContract.id.value;
        DEFAULT_REQUEST.name = expectedContract.name;
        DEFAULT_REQUEST.type = expectedContract.type == null ? null : expectedContract.type.value;

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        expect(expectedContract.equal(mockClientRepository.filterAsync.mock.calls[0]));
    });

    it("Filter Clients; Invalid Type Is Nulled; Success;", async () => {
        // Setup
        const expectedContract = new FilterClientsCriteria({});
        mockClientRepository.filterAsync.mockImplementationOnce(async () => []);

        DEFAULT_REQUEST.type = "bunk type";

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        expect(expectedContract.equal(mockClientRepository.filterAsync.mock.calls[0]));
    });
});
