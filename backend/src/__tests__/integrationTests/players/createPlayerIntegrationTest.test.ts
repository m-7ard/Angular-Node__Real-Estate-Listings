import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import {
    db,
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import ICreatePlayerRequestDTO from "api/DTOs/players/create/ICreatePlayerRequestDTO";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
});

describe("Create Player Integration Test;", () => {
    it("Create Player; Valid Data; Success;", async () => {
        const request: ICreatePlayerRequestDTO = {
            name: "name",
            activeSince: new Date(),
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post("/api/players/create")
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        const rows = await db.queryRows<IPlayerSchema>({ statement: "SELECT * FROM player" });
        expect(rows.length).toBe(1);
    });

    it("Create Player; Invalid Data (Empty name); Failure;", async () => {
        const request: ICreatePlayerRequestDTO = {
            name: "",
            activeSince: new Date(),
        };
        const response = await adminSuperTest({
            agent: supertest(server)
                .post("/api/players/create")
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });
        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });
});
