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
import ICurrentUserRequestDTO from "api/DTOs/users/get-current/ICurrentUserRequestDTO";
import ICurrentUserResponseDTO from "api/DTOs/users/get-current/ICurrentUserResponseDTO";
import authSupertest from "__utils__/integrationTests/authSupertest";

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

describe("Current User Integration Test;", () => {
    it("Current User; Valid Data; Success;", async () => {
        const request: ICurrentUserRequestDTO = {};
        const response = await authSupertest({
            agent: supertest(server)
                .get(`/api/users/current`)
                .send(request)
                .set("Content-Type", "application/json"),
            user: user_001,
            plainPassword: user_001_plain_password,
        });

        expect(response.status).toBe(200);
        const body: ICurrentUserResponseDTO = response.body;
        expect(body.user).not.toBeNull();
        expect(body.user!.id).toBe(user_001.id);
    });

    it("Current User; jwtToken missing; Failure;", async () => {
        const request: ICurrentUserRequestDTO = {};

        const response = await supertest(server)
            .get(`/api/users/current`)
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });

    it("Current User; jwtToken invalid; Failure;", async () => {
        const request: ICurrentUserRequestDTO = {};

        const response = await supertest(server)
            .get(`/api/users/current`)
            .send(request)
            .set("Authorization", `Bearer invalidToken`)
            .set("Content-Type", "application/json");
        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });

    /*
    it("Current User; Invalid Data (Empty email); Failure;", async () => {
        const request: ICurrentUserRequestDTO = {
            email: "",
            password: "userword",
        };

        const response = await supertest(server)
            .get(`/api/users/current`)
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });*/
});
