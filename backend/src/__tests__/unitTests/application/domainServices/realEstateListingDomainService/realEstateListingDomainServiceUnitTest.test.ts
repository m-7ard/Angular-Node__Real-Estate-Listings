import { createRealEstateListingRepositoryMock, createUnitOfWorkMock } from "__mocks__/mocks";
import Mixins from "__utils__/unitTests/Mixins";
import CannotCreateRealEstateListingError from "application/errors/domain/realEstateListings/CannotCreateRealEstateListingError";
import { OrchestrateCreateNewListingContract } from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IRealEstateListingRepository from "application/interfaces/persistence/IRealEstateListingRepository";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import RealEstateListingDomainService from "application/services/domainServices/RealEstateListingDomainService";
import Client from "domain/entities/Client";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

let handler: RealEstateListingDomainService;
let CLIENT_001: Client;
let DEFAULT_CREATE_CONTRACT: OrchestrateCreateNewListingContract;
let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
let mockClientRepo: jest.Mocked<IRealEstateListingRepository>;

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
    CLIENT_001 = Mixins.createClient(1);
    DEFAULT_CREATE_CONTRACT = {
        bathroomNumber: 1,
        bedroomNumber: 1,
        city: "city",
        clientId: CLIENT_001.id,
        country: "country",
        description: "description",
        flooringType: "flooringType",
        id: "id",
        price: 1,
        squareMeters: 1,
        state: "state",
        street: "street",
        title: "title",
        type: RealEstateListingType.HOUSE.value,
        yearBuilt: 1,
        zip: "zip",
        images: []
    };
    mockUnitOfWork = createUnitOfWorkMock();

    mockClientRepo = createRealEstateListingRepositoryMock();
    mockUnitOfWork.realEstateListingRepo = mockClientRepo;

    handler = new RealEstateListingDomainService(mockUnitOfWork);
});

describe("realEstateListingDomainServiceUnitTest.test/tryOrchestractCreateNewListing;", () => {
    it("Try Orchestrate Create New Listing; Valid Data; Success;", async () => {
        // Setup

        // Act
        const result = await handler.tryOrchestractCreateNewListing(DEFAULT_CREATE_CONTRACT);

        // Assert
        expect(result.isOk());
    });

    it("Try Orchestrate Create New Listing; Invalid Type; Failure;", async () => {
        // Setup
        DEFAULT_CREATE_CONTRACT.type = "bunk_type";

        // Act
        const result = await handler.tryOrchestractCreateNewListing(DEFAULT_CREATE_CONTRACT);

        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotCreateRealEstateListingError);
    });

    it("Try Orchestrate Create New Listing; Invalid Price; Failure;", async () => {
        // Setup
        DEFAULT_CREATE_CONTRACT.price = -1;

        // Act
        const result = await handler.tryOrchestractCreateNewListing(DEFAULT_CREATE_CONTRACT);

        // Assert
        expect(result.isErr());
        const error = result.isErr() && result.error;
        expect(error instanceof CannotCreateRealEstateListingError);
    });
});
