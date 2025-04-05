import { createRealEstateListingDomainServiceMock } from "../../../../../__mocks__/mocks";
import Mixins from "../../../../../__utils__/unitTests/Mixins";
import { emptyApplicationError } from "../../../../../__utils__/values/emptyApplicationError";
import ReadRealEstateListingQueryHandler, { ReadRealEstateListingQuery } from "application/handlers/realEstateListings/ReadRealEstateListingQueryHandler";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import { err, ok } from "neverthrow";

let DEFAULT_REQUEST: ReadRealEstateListingQuery;
let CLIENT_001: Client;
let LISTING_001: RealEstateListing;
let mockRealEstateListingDomainService: jest.Mocked<IRealEstateListingDomainService>;
let handler: ReadRealEstateListingQueryHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    mockRealEstateListingDomainService = createRealEstateListingDomainServiceMock();
    CLIENT_001 = Mixins.createClient(1);
    LISTING_001 = Mixins.createRealEstateListing(1, CLIENT_001);
    DEFAULT_REQUEST = new ReadRealEstateListingQuery({ id: LISTING_001.id.value });

    handler = new ReadRealEstateListingQueryHandler(mockRealEstateListingDomainService);
});

describe("readRealEstateListingUnitTest.test;", () => {
    it("Read Listing; Valid Data; Success;", async () => {
        mockRealEstateListingDomainService.tryGetById.mockImplementationOnce(async () => ok(LISTING_001));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isOk());
        const value = result.isOk() && result.value;
        expect(value).toBe(LISTING_001);
    });

    it("Read Listing; Listing Does Not Exist; Success;", async () => {
        mockRealEstateListingDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isOk());
        const value = result.isOk() && result.value;
        expect(value).toBeNull();
    });
});
