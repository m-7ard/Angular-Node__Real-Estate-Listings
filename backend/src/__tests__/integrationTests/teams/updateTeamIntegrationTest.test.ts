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
import IUpdateTeamRequestDTO from "api/DTOs/teams/update/IUpdateTeamRequestDTO";
import Team from "domain/entities/Team";
import Mixins from "__utils__/integrationTests/Mixins";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";

let team_001: Team;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();
    team_001 = await mixins.createTeam(1);
});

describe("Update Team Integration Test;", () => {
    it("Update Team; Valid Data; Success;", async () => {
        const request: IUpdateTeamRequestDTO = {
            dateFounded: new Date(),
            name: "new_name",
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(`/api/teams/${team_001.id}/update`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");

        const [row] = await db.queryRows<ITeamSchema>({
            statement: `SELECT * FROM team WHERE id = ${team_001.id}`,
        });
        expect(row.name).toBe(request.name);
    });

    it("Update Team; Invalid Data (Empty name); Failure;", async () => {
        const request: IUpdateTeamRequestDTO = {
            dateFounded: new Date(),
            name: "",
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(`/api/teams/${team_001.id}/update`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });
});
