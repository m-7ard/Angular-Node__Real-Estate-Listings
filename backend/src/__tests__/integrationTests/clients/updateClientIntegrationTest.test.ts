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
import { UpdateClientRequestDTO } from "../../../../types/api/contracts/clients/update/UpdateClientRequestDTO";
import Client from "domain/entities/Client";
import { DI_TOKENS } from "api/services/DIContainer";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: UpdateClientRequestDTO;
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
        name: "Client 1 updated",
        type: ClientType.CORPORATE.value
    };

    const mixins = new Mixins();

    const admin = await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
    CLIENT_001 = await mixins.createPrivateClient(1);
});

describe("updateClientIntegrationTest;", () => {
    it("Update Client; Valid Data; Success;", async () => {
        // Setup
        const updatedClient001 = Client.executeCreate({
            id: CLIENT_001.id.value,
            name: DEFAULT_REQUEST.name,
            type: DEFAULT_REQUEST.type
        })

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .put(`/api/clients/${CLIENT_001.id}/update`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);
        
        const repo = testingDIContainer.testResolve(DI_TOKENS.CLIENT_REPOSITORY);
        const client = await repo.getByIdAsync(CLIENT_001.id);
        expect(client != null && client.type.equals(updatedClient001.type));
        expect(client != null && client.name === updatedClient001.name);
    });

    it("Update Client; Invalid Type; Failure;", async () => {
        // Setup
        DEFAULT_REQUEST.type = "bunk type";

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .put(`/api/clients/${CLIENT_001.id}/update`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(400);
    });

    it("Update Client; Client Does Not Exist; Failure;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .put(`/api/clients/${1000000}/update`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(404);
    });
});
