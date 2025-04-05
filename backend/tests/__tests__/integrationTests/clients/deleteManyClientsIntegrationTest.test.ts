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
import { FilterRealEstateListingsCriteria } from "application/interfaces/persistence/IRealEstateListingRepository";
import { DeleteManyClientsRequestDTO } from "../../../../types/api/contracts/clients/deleteMany/DeleteManyClientsRequestDTO";
import urlWithQuery from "../../../__utils__/integrationTests/urlWithQuery";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: DeleteManyClientsRequestDTO;
let CLIENT_001: Client;
let CLIENT_002: Client;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();

    const admin = await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
    CLIENT_001 = await mixins.createPrivateClient(1);
    CLIENT_002 = await mixins.createPrivateClient(2);

    DEFAULT_REQUEST = {
        force: false,
        ids: [CLIENT_001.id.value, CLIENT_002.id.value]
    };
});

describe("deleteManyClientsIntegrationTest.test;", () => {
    it("Delete Many Clients; Clients Have No Listings; Success;", async () => {
        // Setup
        const url = urlWithQuery(`/api/clients/delete`, { ids: DEFAULT_REQUEST.ids });

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
        
        const repo = testingDIContainer.testResolve(DI_TOKENS.CLIENT_REPOSITORY);
        const client_001 = await repo.getByIdAsync(CLIENT_001.id);
        expect(client_001 == null);
        
        const client_002 = await repo.getByIdAsync(CLIENT_002.id);
        expect(client_002 == null);
    });

    it("Delete Many Clients; Client Has Listings & Force; Success;", async () => {
        // Setup
        const mixins = new Mixins();
        await mixins.createHouseRealEstateListing(1, CLIENT_001);
        DEFAULT_REQUEST.force = true;
        const url = urlWithQuery(`/api/clients/delete`, { ids: DEFAULT_REQUEST.ids });

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
        
        const clientRepo = testingDIContainer.testResolve(DI_TOKENS.CLIENT_REPOSITORY);
        const client = await clientRepo.getByIdAsync(CLIENT_001.id);
        expect(client == null);

        const realEstateListingRepo = testingDIContainer.testResolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);
        const listings = await realEstateListingRepo.filterAsync(new FilterRealEstateListingsCriteria({}));
        expect(listings.length).toBe(0);
    });

    it("Delete Many Clients; Client Does Not Exist; Failure;", async () => {
        // Setup
        const url = urlWithQuery(`/api/clients/delete`, { ids: [10000000] });

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

    it("Delete Many Clients; Client Has Listings & No Force; Failure;", async () => {
        // Setup
        const mixins = new Mixins();
        await mixins.createHouseRealEstateListing(1, CLIENT_001);
        const url = urlWithQuery(`/api/clients/delete`, { ids: [10000000] });

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
        
        const clientRepo = testingDIContainer.testResolve(DI_TOKENS.CLIENT_REPOSITORY);
        const client_001 = await clientRepo.getByIdAsync(CLIENT_001.id);
        const client_002 = await clientRepo.getByIdAsync(CLIENT_002.id);
        expect(client_001).not.toBeNull();
        expect(client_002).not.toBeNull();
    });
});
