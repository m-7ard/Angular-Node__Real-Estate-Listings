import { createRealEstateListingRepositoryMock } from "../../../../../__mocks__/mocks";
import Mixins from "../../../../../__utils__/unitTests/Mixins";
import FilterRealEstateListingsQueryHandler, { FilterRealEstateListingsQuery } from "application/handlers/realEstateListings/FilterRealEstateListingsQueryHandler";
import IRealEstateListingRepository, { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import ClientId from "domain/valueObjects/Client/ClientId";
import Money from "domain/valueObjects/Common/Money";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

let DEFAULT_REQUEST: FilterRealEstateListingsQuery;
let CLIENT_001: Client;
let LISTING_001: RealEstateListing;
let handler: FilterRealEstateListingsQueryHandler;
let mockRealEstateListingRepository: jest.Mocked<IRealEstateListingRepository>;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    CLIENT_001 = Mixins.createClient(1);
    LISTING_001 = Mixins.createRealEstateListing(1, CLIENT_001);
    DEFAULT_REQUEST = new FilterRealEstateListingsQuery({});

    mockRealEstateListingRepository = createRealEstateListingRepositoryMock();
    handler = new FilterRealEstateListingsQueryHandler(mockRealEstateListingRepository);
});

describe("filterRealEstateListingUnitTest.test;", () => {
    it("Filter Listing; Empty Data; Success;", async () => {
        // Setup
        const expectedContract = new FilterRealEstateListingsCriteria({});
        mockRealEstateListingRepository.filterAsync.mockImplementationOnce(async () => []);

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        expect(expectedContract.equal(mockRealEstateListingRepository.filterAsync.mock.calls[0]));
    });

    it("Filter Listing; Full Data; Success;", async () => {
        // Setup
        const expectedContract = new FilterRealEstateListingsCriteria({
            city: "city",
            clientId: ClientId.executeCreate("ClientId"),
            country: "country",
            maxPrice: Money.executeCreate(100),
            minPrice: Money.executeCreate(0),
            state: "state",
            type: RealEstateListingType.HOUSE,
            zip: "zip",
        });
        mockRealEstateListingRepository.filterAsync.mockImplementationOnce(async () => []);

        DEFAULT_REQUEST.city = expectedContract.city;
        DEFAULT_REQUEST.clientId = expectedContract.clientId == null ? null : expectedContract.clientId.value;
        DEFAULT_REQUEST.country = expectedContract.country;
        DEFAULT_REQUEST.maxPrice = expectedContract.maxPrice == null ? null : expectedContract.maxPrice.value;
        DEFAULT_REQUEST.minPrice = expectedContract.minPrice == null ? null : expectedContract.minPrice.value;
        DEFAULT_REQUEST.state = expectedContract.state;
        DEFAULT_REQUEST.type = expectedContract.type == null ? null : expectedContract.type.value;
        DEFAULT_REQUEST.zip = expectedContract.zip;

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        expect(expectedContract.equal(mockRealEstateListingRepository.filterAsync.mock.calls[0]));
    });

    it("Filter Listing; Negative Prices Are Nulled; Success;", async () => {
        // Setup
        const expectedContract = new FilterRealEstateListingsCriteria({});
        DEFAULT_REQUEST.maxPrice = -100;
        DEFAULT_REQUEST.minPrice = -0.01;

        mockRealEstateListingRepository.filterAsync.mockImplementationOnce(async () => []);

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        expect(expectedContract.equal(mockRealEstateListingRepository.filterAsync.mock.calls[0]));
    });

    it("Filter Listing; Invalid Prices Are Nulled; Success;", async () => {
        // Setup
        const expectedContract = new FilterRealEstateListingsCriteria({});
        DEFAULT_REQUEST.maxPrice = 1;
        DEFAULT_REQUEST.minPrice = 100;

        mockRealEstateListingRepository.filterAsync.mockImplementationOnce(async () => []);

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);

        // Assert
        expect(result.isOk());
        expect(expectedContract.equal(mockRealEstateListingRepository.filterAsync.mock.calls[0]));
    });

    it("Filter Listing; Invalid Type Is Nulled; Success;", async () => {
        // Setup
        const expectedContract = new FilterRealEstateListingsCriteria({});
        DEFAULT_REQUEST.type = "bunk type";

        mockRealEstateListingRepository.filterAsync.mockImplementationOnce(async () => []);

        // Act
        const result = await handler.handle(DEFAULT_REQUEST);
        // Assert

        expect(result.isOk());
        expect(expectedContract.equal(mockRealEstateListingRepository.filterAsync.mock.calls[0]));
    });
});
