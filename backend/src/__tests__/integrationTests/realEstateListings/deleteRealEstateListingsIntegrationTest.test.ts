import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
    testingDIContainer,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import User from "domain/entities/User";
import authSupertest from "__utils__/integrationTests/authSupertest";
import Mixins from "__utils__/integrationTests/Mixins";
import Client from "domain/entities/Client";
import { DI_TOKENS } from "api/services/DIContainer";
import RealEstateListingId from "domain/valueObjects/RealEstateListing/RealEstateListingId";
import { CreateRealEstateListingResponseDTO } from "../../../../types/api/contracts/realEstateListings/create/CreateRealEstateListingResponseDTO";
import RealEstateListing from "domain/entities/RealEstateListing";
import { DeleteRealEstateListingRequestDTO } from "../../../../types/api/contracts/realEstateListings/delete/DeleteRealEstateListingRequestDTO";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: DeleteRealEstateListingRequestDTO;
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

    DEFAULT_REQUEST = {};

    const admin = await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
});

describe("deleteRealEstateListingsIntegrationTest.test;", () => {
    it("Delete Real Estate Listing; Valid Data; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .delete(`/api/real-estate-listings/${LISTING_001.id.value}/delete`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: CreateRealEstateListingResponseDTO = response.body;
        const repo = testingDIContainer.testResolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);
        const listing = await repo.getByIdAsync(RealEstateListingId.executeCreate(body.id));
        expect(listing).toBeNull();
    });

    it("Delete Real Estate Listing; Listing Does Not Exist; Failure;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .delete(`/api/real-estate-listings/${100000}/delete`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(404);
    });
});
