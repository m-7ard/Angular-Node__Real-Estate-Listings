import { createRealEstateListingDomainServiceMock, createUnitOfWorkMock } from "__mocks__/mocks";
import Mixins from "__utils__/unitTests/Mixins";
import { emptyApplicationError } from "__utils__/values/emptyApplicationError";
import RealEstateListingDoesNotExistError from "application/errors/application/realEstateListings/RealEstateListingDoesNotExistError";
import DeleteManyRealEstateListingsCommandHandler, { DeleteManyRealEstateListingsCommand } from "application/handlers/realEstateListings/DeleteManyRealEstateListingsCommandHandler";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import { err, ok } from "neverthrow";

let DEFAULT_REQUEST: DeleteManyRealEstateListingsCommand;
let CLIENT_001: Client;
let LISTING_001: RealEstateListing;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
let mockRealEstateListingDomainService: jest.Mocked<IRealEstateListingDomainService>;
let handler: DeleteManyRealEstateListingsCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    mockUnitOfWork = createUnitOfWorkMock();
    mockRealEstateListingDomainService = createRealEstateListingDomainServiceMock();
    CLIENT_001 = Mixins.createClient(1);
    LISTING_001 = Mixins.createRealEstateListing(1, CLIENT_001);
    DEFAULT_REQUEST = new DeleteManyRealEstateListingsCommand({ ids: [LISTING_001.id.value] });

    handler = new DeleteManyRealEstateListingsCommandHandler(mockUnitOfWork, mockRealEstateListingDomainService);
});

describe("deleteRealEstateListingUnitTest.test;", () => {
    it("Delete Listing; Valid Data; Success;", async () => {
        mockRealEstateListingDomainService.tryGetById.mockImplementationOnce(async () => ok(LISTING_001));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isOk());
    });

    it("Delete Listing; Listing Does Not Exist; Failure;", async () => {
        mockRealEstateListingDomainService.tryGetById.mockImplementationOnce(async () => err(emptyApplicationError));
        const result = await handler.handle(DEFAULT_REQUEST);
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof RealEstateListingDoesNotExistError);
    });
});
