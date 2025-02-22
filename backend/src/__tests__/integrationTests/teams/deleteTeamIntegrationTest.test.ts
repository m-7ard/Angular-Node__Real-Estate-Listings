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
import Team from "domain/entities/Team";
import Mixins from "__utils__/integrationTests/Mixins";
import ITeamSchema from "infrastructure/dbSchemas/ITeamSchema";
import IDeleteTeamRequestDTO from "api/DTOs/teams/delete/IDeleteTeamRequestDTO";
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

describe("Delete Team Integration Test;", () => {
    it("Delete Team; Valid Data; Success;", async () => {
        const request: IDeleteTeamRequestDTO = {};

        const response = await adminSuperTest({
            agent: supertest(server)
                .delete(`/api/teams/${team_001.id}/delete`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });
        expect(response.status).toBe(200);

        const [row] = await db.queryRows<ITeamSchema | null>({
            statement: `SELECT * FROM team WHERE id = ${team_001.id}`,
        });
        expect(row == null).toBe(true);
    });

    it("Delete Team; Team does not exist; Failure;", async () => {
        const request: IDeleteTeamRequestDTO = {};

        const response = await adminSuperTest({
            agent: supertest(server)
            .delete(`/api/teams/100/delete`)
            .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});
