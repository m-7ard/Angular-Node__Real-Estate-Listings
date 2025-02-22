import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import IRegisterUserRequestDTO from "api/DTOs/users/register/IRegisterUserRequestDTO";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import IUserRepository from "application/interfaces/IUserRepository";
import IRegisterUserResponseDTO from "api/DTOs/users/register/IRegisterUserResponseDTO";
import Mixins from "__utils__/integrationTests/Mixins";

let userRepository: IUserRepository;

beforeAll(async () => {
    await setUpIntegrationTest();
    userRepository = diContainer.resolve(DI_TOKENS.USER_REPOSITORY);
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
});

describe("Register User Integration Test;", () => {
    it("Register User; Valid Data; Success;", async () => {
        const request: IRegisterUserRequestDTO = {
            name: "new_name",
            email: "user@email.com",
            password: "userword",
        };

        const response = await supertest(server).post(`/api/users/register`).send(request).set("Content-Type", "application/json");

        const body: IRegisterUserResponseDTO = response.body;
        expect(response.status).toBe(201);

        const user = await userRepository.getByIdAsync(body.id);
        expect(user).not.toBeNull();
    });

    it("Register User; User Already Exists; Failure;", async () => {
        const mixins = new Mixins();
        const { user } = await mixins.createUser(1, false);

        const request: IRegisterUserRequestDTO = {
            name: "new_name",
            email: user.email,
            password: "userword",
        };

        const response = await supertest(server).post(`/api/users/register`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(400);
    });

    it("Register User; Invalid Data (Empty name); Failure;", async () => {
        const request: IRegisterUserRequestDTO = {
            name: "",
            email: "user@email.com",
            password: "userword",
        };

        const response = await supertest(server).post(`/api/users/register`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });
});
