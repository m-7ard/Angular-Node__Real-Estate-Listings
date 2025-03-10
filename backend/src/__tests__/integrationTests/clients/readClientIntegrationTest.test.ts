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
import { ReadClientRequestDTO } from "../../../../types/api/contracts/clients/read/ReadClientRequestDTO";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: ReadClientRequestDTO;
let CLIENT_001: Client;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    DEFAULT_REQUEST = {};

    const mixins = new Mixins();

    const admin = await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
    CLIENT_001 = await mixins.createPrivateClient(1);
});

describe("readClientIntegrationTest;", () => {
    it("Read Client; Client Exists; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(`/api/clients/${CLIENT_001.id}`)
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

    it("Read Client; Client Does Not Exist; Failure;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(`/api/clients/${1000000}`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(404);
    });
});
