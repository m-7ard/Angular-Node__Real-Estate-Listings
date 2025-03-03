import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest, testingDIContainer } from "../../../__utils__/integrationTests/integrationTest.setup";
import { DI_TOKENS } from "api/services/DIContainer";
import Mixins from "__utils__/integrationTests/Mixins";
import { RegisterUserRequestDTO } from "../../../../types/api/contracts/users/register/RegisterUserRequestDTO";
import { RegisterUserResponseDTO } from "../../../../types/api/contracts/users/register/RegisterUserResponseDTO";

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
});

describe("Register User Integration Test;", () => {
    it("Register User; Valid Data; Success;", async () => {
        const request: RegisterUserRequestDTO = {
            name: "new_name",
            email: "user@email.com",
            password: "userword",
        };

        const response = await supertest(server).post(`/api/users/register`).send(request).set("Content-Type", "application/json");

        const body: RegisterUserResponseDTO = response.body;
        expect(response.status).toBe(201);

        const userDomainService = testingDIContainer.testResolve(DI_TOKENS.USER_DOMAIN_SERVICE);
        const userExists = await userDomainService.tryGetUserByEmail(request.email);
        expect(userExists.isOk());
    });

    it("Register User; User Already Exists; Failure;", async () => {
        const mixins = new Mixins();
        const { user } = await mixins.createClientUser(1);

        const request: RegisterUserRequestDTO = {
            name: "new_name",
            email: user.email.value,
            password: "userword",
        };

        const response = await supertest(server).post(`/api/users/register`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(400);
    });
});
