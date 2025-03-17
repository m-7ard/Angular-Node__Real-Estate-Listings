import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import User from "domain/entities/User";
import { LoginUserRequestDTO } from "../../../../types/api/contracts/users/login/LoginUserRequestDTO";
import { LoginUserResponseDTO } from "../../../../types/api/contracts/users/login/LoginUserResponseDTO";

let user_001: User;
let user_001_plain_password: string;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();
    const result = await mixins.createClientUser(1);
    user_001 = result.user;
    user_001_plain_password = result.password;
});

describe("Login User Integration Test;", () => {
    it("Login User; Valid Data; Success;", async () => {
        const request: LoginUserRequestDTO = {
            email: user_001.email.value,
            password: user_001_plain_password,
        };

        const response = await supertest(server)
            .post(`/api/users/login`)
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: LoginUserResponseDTO = response.body;
        expect(body.token).toBeDefined();
    });

    it("Login User; User Password Wrong; Failure;", async () => {
        const request: LoginUserRequestDTO = {
            email: user_001.email.value,
            password: user_001_plain_password + "_",
        };

        const response = await supertest(server)
            .post(`/api/users/login`)
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });

    it("Login User; User Does Not Exist; Failure;", async () => {
        const request: LoginUserRequestDTO = {
            email: "unkown_email@mail.com",
            password: "userword",
        };

        const response = await supertest(server)
            .post(`/api/users/login`)
            .send(request)
            .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
    });
});
