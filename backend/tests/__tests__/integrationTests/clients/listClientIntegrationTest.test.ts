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
import { ListClientsRequestDTO } from "../../../../types/api/contracts/clients/list/ListClientsRequestDTO";
import urlWithQuery from "../../../__utils__/integrationTests/urlWithQuery";
import { ListClientsResponseDTO } from "../../../../types/api/contracts/clients/list/ListClientsResponseDTO";
import ClientType from "domain/valueObjects/Client/ClientType";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: ListClientsRequestDTO;
let CLIENT_001: Client;
let CLIENT_002: Client;
let CLIENT_003: Client;

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
    CLIENT_002 = await mixins.createPrivateClient(2);
    CLIENT_003 = await mixins.createPrivateClient(3);
});

describe("filterClientsIntegrationTest;", () => {
    it("Filter Clients; Empty Params; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(urlWithQuery(`/api/clients/`, DEFAULT_REQUEST))
                .send()
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: ListClientsResponseDTO = response.body;
        expect(body.clients.length).toBe(3);
    });

    it("Filter Clients; By Client Id; Success;", async () => {
        // Setup
        DEFAULT_REQUEST.id = CLIENT_001.id.value

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(urlWithQuery(`/api/clients/`, DEFAULT_REQUEST))
                .send()
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);
        
        const body: ListClientsResponseDTO = response.body;
        expect(body.clients.length).toBe(1);
        expect(body.clients[0].id).toBe(CLIENT_001.id.value);
    });

    it("Filter Clients; By Corporate Type; Success;", async () => {
        // Setup
        DEFAULT_REQUEST.type = ClientType.CORPORATE.value;

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(urlWithQuery(`/api/clients/`, DEFAULT_REQUEST))
                .send()
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: ListClientsResponseDTO = response.body;
        expect(body.clients.length).toBe(0);
    });

    it("Filter Clients; By Private Type; Success;", async () => {
        // Setup
        DEFAULT_REQUEST.type = ClientType.PRIVATE.value;

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .get(urlWithQuery(`/api/clients/`, DEFAULT_REQUEST))
                .send()
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(200);

        const body: ListClientsResponseDTO = response.body;
        expect(body.clients.length).toBe(3);
    });
});
