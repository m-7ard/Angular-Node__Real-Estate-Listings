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
import ILoginUserRequestDTO from "api/DTOs/users/login/ILoginUserRequestDTO";
import { JWT_TOKEN_COOKIE_KEY } from "api/utils/constants";
import ILoginUserResponseDTO from "api/DTOs/users/login/ILoginUserResponseDTO";

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
    const result = await mixins.createUser(1, false);
    user_001 = result.user;
    user_001_plain_password = result.password;
});

describe("Login User Integration Test;", () => {
    it("Login User; Valid Data; Success;", async () => {
        const request: ILoginUserRequestDTO = {
            email: user_001.email,
            password: user_001_plain_password,
        };

        const response = await supertest(server)
            .post(`/api/users/login`)
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: ILoginUserResponseDTO = response.body;
        expect(body.token).toBeDefined();
    });

    it("Login User; User Password Wrong; Failure;", async () => {
        const request: ILoginUserRequestDTO = {
            email: user_001.email,
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
        const request: ILoginUserRequestDTO = {
            email: "unkown_email@mail.com",
            password: "userword",
        };

        const response = await supertest(server)
            .post(`/api/users/login`)
            .send(request)
            .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });

    it("Login User; Invalid Data (Empty email); Failure;", async () => {
        const request: ILoginUserRequestDTO = {
            email: "",
            password: "userword",
        };

        const response = await supertest(server)
            .post(`/api/users/login`)
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });
});
