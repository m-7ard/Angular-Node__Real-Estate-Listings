import User from "domain/entities/User";
import ClientType from "domain/valueObjects/Client/ClientType";
import supertest from "supertest";
import { CreateClientRequestDTO } from "../../../../types/api/contracts/clients/create/CreateClientRequestDTO";
import { CreateClientResponseDTO } from "../../../../types/api/contracts/clients/create/CreateClientResponseDTO";
import authSupertest from "../../../__utils__/integrationTests/authSupertest";
import { setUpIntegrationTest, disposeIntegrationTest, resetIntegrationTest, server } from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "../../../__utils__/integrationTests/Mixins";

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
    it("Create Client; Valid Data; Success;", async () => {

        const response = await authSupertest({
            agent: supertest(server)
                .post(`/api/clients/create`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        expect(response.status).toBe(201);
        const body: CreateClientResponseDTO = response.body;
        
    });

});
