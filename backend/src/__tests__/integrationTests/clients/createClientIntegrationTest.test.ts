import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import User from "domain/entities/User";
import authSupertest from "__utils__/integrationTests/authSupertest";
import { CreateClientRequestDTO } from "../../../../types/api/contracts/clients/create/CreateClientRequestDTO";
import ClientType from "domain/valueObjects/Client/ClientType";
import Mixins from "__utils__/integrationTests/Mixins";
import { CreateClientResponseDTO } from "../../../../types/api/contracts/clients/create/CreateClientResponseDTO";

let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: CreateClientRequestDTO;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    DEFAULT_REQUEST = {
        name: "Client 1",
        type: ClientType.PRIVATE.value
    };

    const mixins = new Mixins();

    const admin =  await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;

});

describe("createClientIntegrationTest;", () => {
    it("Current Client; Valid Data; Success;", async () => {

        const response = await authSupertest({
            agent: supertest(server)
                .post(`/api/clients/create`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        expect(response.status).toBe(200);
        const body: CreateClientResponseDTO = response.body;
        
    });

});
