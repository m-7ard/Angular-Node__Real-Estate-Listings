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
import { DI_TOKENS } from "api/services/DIContainer";
import RealEstateListing from "domain/entities/RealEstateListing";
import { DeleteManyRealEstateListingsRequestDTO } from "../../../../types/api/contracts/realEstateListings/deleteMany/DeleteManyRealEstateListingsRequestDTO";
import urlWithQuery from "../../../__utils__/integrationTests/urlWithQuery";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: DeleteManyRealEstateListingsRequestDTO;
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
        ids: [LISTING_001.id.value]
    };

    const admin = await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
});

describe("deleteManyRealEstateListingsIntegrationTest.test;", () => {
    it("Delete Many Real Estate Listings; Valid Data; Success;", async () => {
        // Setup
        const url = urlWithQuery(`/api/real-estate-listings/delete`, DEFAULT_REQUEST);

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .delete(url)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: DeleteManyRealEstateListingsRequestDTO = response.body;
        const repo = testingDIContainer.testResolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);
        const listing = await repo.getByIdAsync(LISTING_001.id);
        expect(listing).toBeNull();
    });

    it("Delete Many Real Estate Listings; Listing Does Not Exist; Failure;", async () => {
        // Setup
        DEFAULT_REQUEST.ids = ["10000000"];
        const url = urlWithQuery(`/api/real-estate-listings/delete`, DEFAULT_REQUEST);

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .delete(url)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(400);
    });
});
