import ICreateTeamRequestDTO from "api/DTOs/teams/create/ICreateTeamRequestDTO";
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
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
});

describe("Create Team Integration Test;", () => {
    it("Create Team; Valid Data; Success;", async () => {
        const request: ICreateTeamRequestDTO = {
            dateFounded: new Date(),
            name: "name",
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post("/api/teams/create")
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        const rows = await db.queryRows<ITeamSchema>({ statement: "SELECT * FROM team" });
        expect(rows.length).toBe(1);
    });

    it("Create Team; Invalid Data (Empty name); Failure;", async () => {
        const request: ICreateTeamRequestDTO = {
            dateFounded: new Date(),
            name: "",
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post("/api/teams/create")
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });
});
