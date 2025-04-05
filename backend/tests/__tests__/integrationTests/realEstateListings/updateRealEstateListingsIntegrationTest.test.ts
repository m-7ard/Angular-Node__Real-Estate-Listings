import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
    testingDIContainer,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import User from "domain/entities/User";
import authSupertest from "../../../__utils__/integrationTests/authSupertest";
import Mixins from "../../../__utils__/integrationTests/Mixins";
import Client from "domain/entities/Client";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";
import { DI_TOKENS } from "api/services/DIContainer";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import { CreateRealEstateListingResponseDTO } from "../../../../types/api/contracts/realEstateListings/create/CreateRealEstateListingResponseDTO";
import RealEstateListing from "domain/entities/RealEstateListing";
import { UpdateRealEstateListingRequestDTO } from "../../../../types/api/contracts/realEstateListings/update/UpdateRealEstateListingRequestDTO";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: UpdateRealEstateListingRequestDTO;
let CLIENT_001: Client;
let LISTING_001: RealEstateListing;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();
    CLIENT_001 = await mixins.createPrivateClient(1);
    LISTING_001 = await mixins.createHouseRealEstateListing(1, CLIENT_001);

    DEFAULT_REQUEST = {
        city: "city",
        clientId: CLIENT_001.id.value,
        country: "country",
        price: 1,
        state: "state",
        street: "street",
        type: RealEstateListingType.APARTMENT.value, // Updated
        zip: "zip",
        squareMeters: 1,
        yearBuilt: 2025,
        bathroomNumber: 1,
        bedroomNumber: 1,
        description: "description",
        flooringType: "flooringType",
        title: "title",
        images: []
    };

    const admin =  await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
});

describe("updateRealEstateListingsIntegrationTest;", () => {
    it("Update Real Estate Listing; Valid Data; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .put(`/api/real-estate-listings/${LISTING_001.id.value}/update`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: CreateRealEstateListingResponseDTO = response.body;
        const repo = testingDIContainer.testResolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);
        const listing = await repo.getByIdAsync(RealEstateListingId.executeCreate(body.id))
        expect(listing != null && listing.type.equals(RealEstateListingType.APARTMENT));
    });

    it("Update Real Estate Listing; Client Does Not Exist; Failure;", async () => {        
        // Setup
        DEFAULT_REQUEST.clientId = "bunk client id";
                
        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .put(`/api/real-estate-listings/${LISTING_001.id.value}/update`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });
        
        // Assert
        expect(response.status).toBe(400);
    });

    it("Update Real Estate Listing; Listing Does Not Exist; Failure;", async () => {        
        // Setup
                
        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .put(`/api/real-estate-listings/${100000}/update`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });
        
        // Assert
        expect(response.status).toBe(404);
    });

    it("Update Real Estate Listing; Invalid Type; Failure;", async () => {        
        // Setup
        DEFAULT_REQUEST.type = "bunk status";
                
        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .put(`/api/real-estate-listings/${LISTING_001.id.value}/update`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });
        
        // Assert
        expect(response.status).toBe(400);
    });
});
