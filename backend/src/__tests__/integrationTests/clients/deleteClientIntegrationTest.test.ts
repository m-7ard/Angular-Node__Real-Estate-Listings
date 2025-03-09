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
import ClientType from "domain/valueObjects/Client/ClientType";
import Mixins from "__utils__/integrationTests/Mixins";
import Client from "domain/entities/Client";
import { DI_TOKENS } from "api/services/DIContainer";
import { DeleteClientRequestDTO } from "../../../../types/api/contracts/clients/delete/DeleteClientRequestDTO";
import { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: DeleteClientRequestDTO;
let CLIENT_001: Client;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    DEFAULT_REQUEST = {
        force: false,
    };

    const mixins = new Mixins();

    const admin = await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
    CLIENT_001 = await mixins.createPrivateClient(1);
});

describe("deleteClientIntegrationTest;", () => {
    it("Delete Client; Client Has No Listings; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .delete(`/api/clients/${CLIENT_001.id}/delete`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);
        
        const repo = testingDIContainer.testResolve(DI_TOKENS.CLIENT_REPOSITORY);
        const client = await repo.getByIdAsync(CLIENT_001.id);
        expect(client == null);
    });

    it("Delete Client; Client Has Listings & Force; Success;", async () => {
        // Setup
        const mixins = new Mixins();
        await mixins.createHouseRealEstateListing(1, CLIENT_001);
        DEFAULT_REQUEST.force = true;

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .delete(`/api/clients/${CLIENT_001.id}/delete`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);
        
        const clientRepo = testingDIContainer.testResolve(DI_TOKENS.CLIENT_REPOSITORY);
        const client = await clientRepo.getByIdAsync(CLIENT_001.id);
        expect(client == null);

        const realEstateListingRepo = testingDIContainer.testResolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);
        const listings = await realEstateListingRepo.filterAsync(new FilterRealEstateListingsCriteria({}));
        expect(listings.length).toBe(0);
    });

    it("Delete Client; Client Does Not Exist; Failure;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .delete(`/api/clients/${1000000}/delete`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(404);
    });

    it("Delete Client; Client Has Listings & No Force; Failure;", async () => {
        // Setup
        const mixins = new Mixins();
        await mixins.createHouseRealEstateListing(1, CLIENT_001);

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .delete(`/api/clients/${CLIENT_001.id}/delete`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(400);
    });
});
