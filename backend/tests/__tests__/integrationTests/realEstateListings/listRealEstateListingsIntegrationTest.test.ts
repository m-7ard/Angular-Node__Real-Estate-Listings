import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import User from "domain/entities/User";
import authSupertest from "../../../__utils__/integrationTests/authSupertest";
import Mixins from "../../../__utils__/integrationTests/Mixins";
import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import { ListRealEstateListingsRequestDTO } from "../../../../types/api/contracts/realEstateListings/list/ListRealEstateListingsRequestDTO";
import { ListRealEstateListingsResponseDTO } from "../../../../types/api/contracts/realEstateListings/list/ListRealEstateListingsResponseDTO";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";
import urlWithQuery from "../../../__utils__/integrationTests/urlWithQuery";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: ListRealEstateListingsRequestDTO;
let CLIENT_001: Client;
let CLIENT_002: Client;
let CLIENT_003: Client;
let LISTING_001: RealEstateListing;
let LISTING_002: RealEstateListing;
let LISTING_003: RealEstateListing;

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
    CLIENT_002 = await mixins.createPrivateClient(2);
    CLIENT_003 = await mixins.createPrivateClient(3);
    LISTING_001 = await mixins.createHouseRealEstateListing(1, CLIENT_001);
    LISTING_002 = await mixins.createHouseRealEstateListing(2, CLIENT_002);
    LISTING_003 = await mixins.createHouseRealEstateListing(3, CLIENT_003);

    DEFAULT_REQUEST = {};

    const admin = await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
});

describe("listRealEstateListingsIntegrationTest.test;", () => {
    it("List Real Estate Listing; Empty Params; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(urlWithQuery(`/api/real-estate-listings/`, DEFAULT_REQUEST))
                .send()
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: ListRealEstateListingsResponseDTO = response.body;
        expect(body.listings.length).toBe(3);
    });

    it("List Real Estate Listing; By Client Id; Success;", async () => {
        // Setup
        DEFAULT_REQUEST.clientId = CLIENT_001.id.value;

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(urlWithQuery(`/api/real-estate-listings/`, DEFAULT_REQUEST))
                .send()
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: ListRealEstateListingsResponseDTO = response.body;
        expect(body.listings.length).toBe(1);
    });

    it("List Real Estate Listing; By House Type Success;", async () => {
        // Setup
        DEFAULT_REQUEST.type = RealEstateListingType.HOUSE.value;

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(urlWithQuery(`/api/real-estate-listings/`, DEFAULT_REQUEST))
                .send()
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: ListRealEstateListingsResponseDTO = response.body;
        expect(body.listings.length).toBe(3);
    });

    it("List Real Estate Listing; By Apartment Type Success;", async () => {
        // Setup
        DEFAULT_REQUEST.type = RealEstateListingType.APARTMENT.value;

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(urlWithQuery(`/api/real-estate-listings/`, DEFAULT_REQUEST))
                .send()
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: ListRealEstateListingsResponseDTO = response.body;
        expect(body.listings.length).toBe(0);
    });
});
